import { useMemo } from "react";
import { Poem } from "@shared/schema";

interface JsonLdSchemaProps {
  poem: Poem;
}

export default function JsonLdSchema({ poem }: JsonLdSchemaProps) {
  const jsonLd = useMemo(() => {
    const poemContent = poem.content as any;
    const fullText = poemContent.stanzas
      .map((stanza: any) => stanza.lines.join('\n'))
      .join('\n\n') + '\n\n' + poemContent.endMessage;

    return {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "@id": `#poem-${poem.id}`,
      "name": poem.title,
      "text": fullText,
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
      "interactionStatistic": {
        "@type": "InteractionCounter",
        "interactionType": "https://schema.org/CommentAction",
        "userInteractionCount": 0,
        "description": "Interactive elements allowing real-time parameter modification"
      },
      "mainEntity": {
        "@type": "Dataset",
        "name": "Hyperdimensional Poetry Parameters",
        "description": "8-dimensional parameter space defining the poem's characteristics",
        "distribution": {
          "@type": "DataDownload",
          "contentUrl": `/api/poems/${poem.id}`,
          "encodingFormat": "application/json"
        },
        "variableMeasured": [
          {
            "@type": "PropertyValue",
            "name": "Chaos Frequency",
            "value": poem.chaosValue * 10,
            "unitText": "Hz",
            "description": "Vibration frequency in the consciousness field"
          },
          {
            "@type": "PropertyValue",
            "name": "Consciousness Field Radius",
            "value": poem.consciousnessValue * 80,
            "unitText": "pixels",
            "description": "Radius of consciousness visualization"
          },
          {
            "@type": "PropertyValue",
            "name": "Gödel Spiral Iterations",
            "value": parseInt(poem.godelNumber) % 100,
            "unitText": "iterations",
            "description": "Number of iterations in the Gödel spiral visualization"
          }
        ]
      },
      "potentialAction": [
        {
          "@type": "InteractAction",
          "name": "Modify Poetry Parameters",
          "description": "Adjust chaos, beauty, complexity, coherence, and consciousness values",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `/api/poems/${poem.id}`,
            "httpMethod": "PATCH"
          }
        },
        {
          "@type": "ReadAction",
          "name": "View Hyperdimensional Visualization",
          "description": "Explore 8D parameter space projected to 2D",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `/#poem-${poem.id}`,
            "httpMethod": "GET"
          }
        }
      ],
      "spatialCoverage": {
        "@type": "Place",
        "name": "8-Dimensional Parameter Space",
        "description": "Hyperdimensional space containing consciousness, chaos, beauty, complexity, coherence, cycles, Gödel numbers, and temporal dimensions"
      }
    };
  }, [poem]);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, 2) }}
    />
  );
}