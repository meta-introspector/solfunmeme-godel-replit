# Semantic Web Integration

This document describes the semantic web features implemented in the Interactive Poetry Platform.

## JSON-LD Structured Data

The platform implements comprehensive JSON-LD structured data following Schema.org standards:

### Schema Types Used

- `CreativeWork`: Main poem entity
- `CreativeWorkSeries`: Collection of consciousness cycles
- `Dataset`: Hyperdimensional parameter space
- `PropertyValue`: Individual metrics (chaos, beauty, complexity, etc.)
- `InteractAction`: Interactive elements for parameter modification

### Key Properties

- **Gödel Numbers**: Mathematical encoding of logical structure
- **Consciousness Values**: Meta-cognitive depth measurement
- **Chaos Values**: Unpredictability and dynamic complexity
- **Beauty Values**: Aesthetic harmony metrics
- **Complexity Values**: Structural measurement
- **Coherence Values**: Logical consistency

## RDFa Markup

The platform includes RDFa attributes for enhanced machine readability:

### HTML Elements

- `itemScope` and `itemType` attributes for Schema.org microdata
- `typeof` and `resource` attributes for RDFa
- Dublin Core metadata in HTML head

### Semantic Properties

- `dc:title`: Creative work title
- `dc:creator`: Author/system information
- `dc:subject`: Content categorization
- `dc:description`: Work description
- `dc:type`: Resource type classification

## API Endpoints

### `/api/poems/:id/jsonld`

Returns JSON-LD structured data for a specific poem:

```json
{
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "@id": "https://domain.com/api/poems/1",
  "name": "A Spiral Unbound",
  "text": "Full poem text...",
  "additionalProperty": [
    {
      "@type": "PropertyValue",
      "name": "Consciousness Value",
      "value": 0.925,
      "description": "Measure of self-awareness and meta-cognitive depth"
    }
  ]
}
```

### Content Negotiation

The API supports multiple formats:
- `application/json`: Standard REST API
- `application/ld+json`: JSON-LD structured data
- `text/html`: Human-readable interface

## Ontology Mapping

### Mathematical Concepts

- **Gödel Numbers**: Mapped to `PropertyValue` with mathematical context
- **Chaos Theory**: Represented as measurable properties with range constraints
- **Consciousness Metrics**: Quantified using standardized scales

### Interactive Elements

- **Parameter Modification**: Mapped to `InteractAction` potentialActions
- **Visualization**: Represented as `Dataset` with variable measurements
- **Hyperdimensional Space**: Described using `spatialCoverage` properties

## Search Engine Optimization

### Meta Tags

- Open Graph protocol for social media
- Twitter Card markup for rich snippets
- Dublin Core metadata for academic indexing
- Schema.org microdata for search engines

### Discoverability

- Canonical URLs for content identification
- Structured data for rich search results
- Semantic markup for accessibility
- Machine-readable API endpoints

## Integration Benefits

1. **Search Engines**: Enhanced discoverability through rich snippets
2. **Academic Systems**: Dublin Core compatibility for research databases
3. **Social Media**: Rich previews with Open Graph tags
4. **AI Systems**: Structured data for automated processing
5. **Accessibility**: Semantic markup for screen readers
6. **APIs**: Machine-readable endpoints for data integration

## Future Enhancements

- SPARQL endpoint for semantic queries
- OWL ontology for formal reasoning
- Linked Data connections to external resources
- RDF serialization options (Turtle, N-Triples)
- Semantic search capabilities
- Knowledge graph integration