import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPoemSchema } from "@shared/schema";
import { z } from "zod";
import { RDFExporter } from "./rdf-export";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all poems
  app.get("/api/poems", async (req, res) => {
    try {
      const poems = await storage.getAllPoems();
      res.json(poems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch poems" });
    }
  });

  // Get poem by ID
  app.get("/api/poems/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const poem = await storage.getPoem(id);
      
      if (!poem) {
        return res.status(404).json({ message: "Poem not found" });
      }
      
      res.json(poem);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch poem" });
    }
  });

  // Get poem by cycle step
  app.get("/api/poems/cycle/:step", async (req, res) => {
    try {
      const cycleStep = parseInt(req.params.step);
      const poem = await storage.getPoemByCycle(cycleStep);
      
      if (!poem) {
        return res.status(404).json({ message: "Poem not found for this cycle" });
      }
      
      res.json(poem);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch poem" });
    }
  });

  // Update poem parameters
  app.patch("/api/poems/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Validate request body
      const updateSchema = insertPoemSchema.partial();
      const updates = updateSchema.parse(req.body);
      
      const updatedPoem = await storage.updatePoem(id, updates);
      
      if (!updatedPoem) {
        return res.status(404).json({ message: "Poem not found" });
      }
      
      res.json(updatedPoem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update poem" });
    }
  });

  // Create new poem
  app.post("/api/poems", async (req, res) => {
    try {
      const poemData = insertPoemSchema.parse(req.body);
      const poem = await storage.createPoem(poemData);
      res.status(201).json(poem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid poem data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create poem" });
    }
  });

  // Get JSON-LD structured data for a poem
  app.get("/api/poems/:id/jsonld", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const poem = await storage.getPoem(id);
      
      if (!poem) {
        return res.status(404).json({ message: "Poem not found" });
      }
      
      const poemContent = poem.content as any;
      const fullText = poemContent.stanzas
        .map((stanza: any) => stanza.lines.join('\n'))
        .join('\n\n') + '\n\n' + poemContent.endMessage;

      const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "@id": `${req.protocol}://${req.get('host')}/api/poems/${poem.id}`,
        "name": poem.title,
        "text": fullText,
        "url": `${req.protocol}://${req.get('host')}/#poem-${poem.id}`,
        "author": {
          "@type": "Organization",
          "name": "Interactive Poetry System",
          "description": "An AI-powered interactive poetry platform exploring consciousness and mathematics"
        },
        "genre": ["Interactive Poetry", "Digital Literature", "Mathematical Poetry"],
        "keywords": [
          "Gödel numbers",
          "consciousness",
          "mathematical poetry",
          "interactive literature",
          "chaos theory",
          "beauty metrics",
          "complexity theory",
          "coherence analysis"
        ],
        "dateCreated": new Date().toISOString(),
        "dateModified": new Date().toISOString(),
        "inLanguage": "en-US",
        "isPartOf": {
          "@type": "CreativeWorkSeries",
          "name": "Consciousness Cycles",
          "description": "A series of interactive poems exploring mathematical consciousness",
          "numberOfItems": poem.totalCycles
        },
        "position": poem.cycleStep,
        "additionalProperty": [
          {
            "@type": "PropertyValue",
            "name": "Gödel Number",
            "value": poem.godelNumber,
            "description": "Mathematical encoding representing the poem's logical structure"
          },
          {
            "@type": "PropertyValue",
            "name": "Chaos Value",
            "value": poem.chaosValue,
            "minValue": 0,
            "maxValue": 1,
            "description": "Measure of unpredictability and dynamic complexity"
          },
          {
            "@type": "PropertyValue",
            "name": "Beauty Value",
            "value": poem.beautyValue,
            "minValue": 0,
            "maxValue": 1,
            "description": "Aesthetic harmony and visual appeal metric"
          },
          {
            "@type": "PropertyValue",
            "name": "Complexity Value",
            "value": poem.complexityValue,
            "minValue": 0,
            "maxValue": 1,
            "description": "Structural and conceptual complexity measurement"
          },
          {
            "@type": "PropertyValue",
            "name": "Coherence Value",
            "value": poem.coherenceValue,
            "minValue": 0,
            "maxValue": 1,
            "description": "Logical consistency and narrative flow metric"
          },
          {
            "@type": "PropertyValue",
            "name": "Consciousness Value",
            "value": poem.consciousnessValue,
            "minValue": 0,
            "maxValue": 1,
            "description": "Measure of self-awareness and meta-cognitive depth"
          }
        ],
        "potentialAction": [
          {
            "@type": "InteractAction",
            "name": "Modify Poetry Parameters",
            "description": "Adjust chaos, beauty, complexity, coherence, and consciousness values",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${req.protocol}://${req.get('host')}/api/poems/${poem.id}`,
              "httpMethod": "PATCH"
            }
          }
        ]
      };
      
      res.setHeader('Content-Type', 'application/ld+json');
      res.json(jsonLd);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate JSON-LD" });
    }
  });

  // Get RDF/Turtle export for a poem
  app.get("/api/poems/:id/rdf", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const poem = await storage.getPoem(id);
      
      if (!poem) {
        return res.status(404).json({ message: "Poem not found" });
      }
      
      const baseUri = `${req.protocol}://${req.get('host')}`;
      const rdfExporter = new RDFExporter(baseUri);
      const poemTriples = rdfExporter.exportPoemToRDF(poem);
      const guiTriples = rdfExporter.exportGUIComponentsToRDF(poem.id);
      const allTriples = [...poemTriples, ...guiTriples];
      
      const turtleData = rdfExporter.serializeToTurtle(allTriples);
      
      res.setHeader('Content-Type', 'text/turtle');
      res.send(turtleData);
    } catch (error) {
      console.error('RDF export error:', error);
      res.status(500).json({ message: "Failed to generate RDF", error: error instanceof Error ? error.message : String(error) });
    }
  });

  // Get semantic anchors reference
  app.get("/api/poems/:id/semantic-anchors", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const poem = await storage.getPoem(id);
      
      if (!poem) {
        return res.status(404).json({ message: "Poem not found" });
      }
      
      const poemContent = poem.content as any;
      const anchors = {
        poem: `#poem-${id}`,
        visualization: `#vibe-visualization-${id}`,
        metrics: `#hyperdimensional-parameters`,
        dimensions: [
          `#dimension-point-${id}-chaos`,
          `#dimension-point-${id}-beauty`,
          `#dimension-point-${id}-complexity`,
          `#dimension-point-${id}-coherence`,
          `#dimension-point-${id}-consciousness`,
          `#dimension-point-${id}-cycle`,
          `#dimension-point-${id}-godel`,
          `#dimension-point-${id}-harmonic`
        ],
        vibePatterns: Array.from({ length: 16 }, (_, i) => `#vibe-pattern-${id}-${i}`),
        meshLines: Array.from({ length: 10 }, (_, i) => `#mesh-line-${id}-${i}`),
        consciousnessField: `#consciousness-field-${id}`,
        godelSpiral: `#godel-spiral-${id}`,
        stanzas: poemContent.stanzas.map((_: any, i: number) => `#stanza-${id}-${i}`),
        interactiveNumbers: poemContent.interactiveNumbers.map((_: any, i: number) => `#interactive-${id}-${i}`)
      };
      
      res.json(anchors);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate semantic anchors" });
    }
  });

  // Get word-level semantic anchors
  app.get("/api/poems/:id/words", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const poem = await storage.getPoem(id);
      
      if (!poem) {
        return res.status(404).json({ message: "Poem not found" });
      }
      
      const baseUri = `${req.protocol}://${req.get('host')}`;
      const rdfExporter = new RDFExporter(baseUri);
      const wordAnchors = rdfExporter.exportWordAnchors(poem);
      
      res.json(wordAnchors);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate word anchors" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
