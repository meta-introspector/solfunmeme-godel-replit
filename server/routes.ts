import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPoemSchema } from "@shared/schema";
import { z } from "zod";

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

  const httpServer = createServer(app);
  return httpServer;
}
