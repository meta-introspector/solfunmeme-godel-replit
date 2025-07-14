import { Poem } from '../shared/schema';

export interface RDFTriple {
  subject: string;
  predicate: string;
  object: string;
  datatype?: string;
}

export class RDFExporter {
  private baseUri: string;
  private prefixes: Record<string, string> = {
    'schema': 'https://schema.org/',
    'dc': 'http://purl.org/dc/terms/',
    'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    'rdfs': 'http://www.w3.org/2000/01/rdf-schema#',
    'xsd': 'http://www.w3.org/2001/XMLSchema#',
    'foaf': 'http://xmlns.com/foaf/0.1/',
    'poetry': 'https://poetry.platform/vocab/',
    'math': 'https://www.w3.org/2000/10/swap/math#',
    'consciousness': 'https://consciousness.vocab/terms/'
  };

  constructor(baseUri: string) {
    this.baseUri = baseUri;
  }

  exportPoemToRDF(poem: Poem): RDFTriple[] {
    const triples: RDFTriple[] = [];
    const poemUri = `${this.baseUri}/poems/${poem.id}`;
    const poemContent = poem.content as any;

    // Basic poem metadata
    triples.push(
      { subject: poemUri, predicate: 'rdf:type', object: 'schema:CreativeWork' },
      { subject: poemUri, predicate: 'rdf:type', object: 'poetry:InteractivePoem' },
      { subject: poemUri, predicate: 'schema:name', object: `"${poem.title}"`, datatype: 'xsd:string' },
      { subject: poemUri, predicate: 'dc:title', object: `"${poem.title}"`, datatype: 'xsd:string' },
      { subject: poemUri, predicate: 'schema:position', object: poem.cycleStep.toString(), datatype: 'xsd:integer' },
      { subject: poemUri, predicate: 'poetry:cycleStep', object: poem.cycleStep.toString(), datatype: 'xsd:integer' },
      { subject: poemUri, predicate: 'poetry:totalCycles', object: poem.totalCycles.toString(), datatype: 'xsd:integer' },
      { subject: poemUri, predicate: 'poetry:godelNumber', object: poem.godelNumber.toString(), datatype: 'xsd:long' }
    );

    // Mathematical and consciousness properties
    this.addMetricTriples(triples, poemUri, 'chaosValue', poem.chaosValue);
    this.addMetricTriples(triples, poemUri, 'beautyValue', poem.beautyValue);
    this.addMetricTriples(triples, poemUri, 'complexityValue', poem.complexityValue);
    this.addMetricTriples(triples, poemUri, 'coherenceValue', poem.coherenceValue);
    this.addMetricTriples(triples, poemUri, 'consciousnessValue', poem.consciousnessValue);

    // Stanza structure
    poemContent.stanzas.forEach((stanza: any, stanzaIndex: number) => {
      const stanzaUri = `${poemUri}/stanza/${stanzaIndex}`;
      triples.push(
        { subject: stanzaUri, predicate: 'rdf:type', object: 'poetry:Stanza' },
        { subject: poemUri, predicate: 'poetry:hasStanza', object: stanzaUri },
        { subject: stanzaUri, predicate: 'schema:position', object: stanzaIndex.toString(), datatype: 'xsd:integer' }
      );

      // Lines within stanza
      stanza.lines.forEach((line: string, lineIndex: number) => {
        const lineUri = `${stanzaUri}/line/${lineIndex}`;
        triples.push(
          { subject: lineUri, predicate: 'rdf:type', object: 'poetry:Line' },
          { subject: stanzaUri, predicate: 'poetry:hasLine', object: lineUri },
          { subject: lineUri, predicate: 'schema:position', object: lineIndex.toString(), datatype: 'xsd:integer' },
          { subject: lineUri, predicate: 'schema:text', object: `"${line}"`, datatype: 'xsd:string' }
        );

        // Add word-level semantic anchors
        const words = line.split(/(\s+)/).filter(word => word.trim() !== '');
        words.forEach((word, wordIndex) => {
          const wordUri = `${lineUri}/word/${wordIndex}`;
          const cleanWord = word.replace(/[^\w\s]/g, '').toLowerCase();
          triples.push(
            { subject: wordUri, predicate: 'rdf:type', object: 'poetry:Word' },
            { subject: lineUri, predicate: 'poetry:hasWord', object: wordUri },
            { subject: wordUri, predicate: 'schema:position', object: wordIndex.toString(), datatype: 'xsd:integer' },
            { subject: wordUri, predicate: 'schema:text', object: `"${word}"`, datatype: 'xsd:string' },
            { subject: wordUri, predicate: 'poetry:cleanText', object: `"${cleanWord}"`, datatype: 'xsd:string' },
            { subject: wordUri, predicate: 'poetry:wordLength', object: word.length.toString(), datatype: 'xsd:integer' },
            { subject: wordUri, predicate: 'poetry:anchorId', object: `"word-${poem.id}-${stanzaIndex}-${lineIndex}-${wordIndex}"`, datatype: 'xsd:string' }
          );
        });
      });
    });

    // Interactive numbers from stanzas
    poemContent.stanzas.forEach((stanza: any, stanzaIndex: number) => {
      if (stanza.interactiveNumbers) {
        stanza.interactiveNumbers.forEach((number: any, index: number) => {
          const numberUri = `${poemUri}/stanza/${stanzaIndex}/interactive/${index}`;
          triples.push(
            { subject: numberUri, predicate: 'rdf:type', object: 'poetry:InteractiveNumber' },
            { subject: poemUri, predicate: 'poetry:hasInteractiveElement', object: numberUri },
            { subject: numberUri, predicate: 'schema:value', object: `"${number.value}"`, datatype: 'xsd:string' },
            { subject: numberUri, predicate: 'poetry:type', object: `"${number.type}"`, datatype: 'xsd:string' },
            { subject: numberUri, predicate: 'poetry:stanzaIndex', object: stanzaIndex.toString(), datatype: 'xsd:integer' },
            { subject: numberUri, predicate: 'poetry:interactiveIndex', object: index.toString(), datatype: 'xsd:integer' }
          );
          
          if (number.binding) {
            triples.push(
              { subject: numberUri, predicate: 'poetry:boundTo', object: `"${number.binding}"`, datatype: 'xsd:string' }
            );
          }
        });
      }
    });

    // End message
    if (poemContent.endMessage) {
      const endMessageUri = `${poemUri}/endMessage`;
      triples.push(
        { subject: endMessageUri, predicate: 'rdf:type', object: 'poetry:EndMessage' },
        { subject: poemUri, predicate: 'poetry:hasEndMessage', object: endMessageUri },
        { subject: endMessageUri, predicate: 'schema:text', object: `"${poemContent.endMessage}"`, datatype: 'xsd:string' }
      );
    }

    return triples;
  }

  private addMetricTriples(triples: RDFTriple[], poemUri: string, metricName: string, value: number) {
    const metricUri = `${poemUri}/metric/${metricName}`;
    triples.push(
      { subject: metricUri, predicate: 'rdf:type', object: 'consciousness:Metric' },
      { subject: poemUri, predicate: `consciousness:has${metricName.charAt(0).toUpperCase() + metricName.slice(1)}`, object: metricUri },
      { subject: metricUri, predicate: 'schema:name', object: `"${metricName}"`, datatype: 'xsd:string' },
      { subject: metricUri, predicate: 'schema:value', object: value.toString(), datatype: 'xsd:decimal' },
      { subject: metricUri, predicate: 'consciousness:minValue', object: '0.0', datatype: 'xsd:decimal' },
      { subject: metricUri, predicate: 'consciousness:maxValue', object: '1.0', datatype: 'xsd:decimal' }
    );
  }

  exportGUIComponentsToRDF(poemId: number): RDFTriple[] {
    const triples: RDFTriple[] = [];
    const guiUri = `${this.baseUri}/gui/poem/${poemId}`;

    // Main interface
    triples.push(
      { subject: guiUri, predicate: 'rdf:type', object: 'schema:UserInterface' },
      { subject: guiUri, predicate: 'rdf:type', object: 'poetry:InteractiveInterface' },
      { subject: guiUri, predicate: 'schema:name', object: '"Interactive Poetry Interface"', datatype: 'xsd:string' }
    );

    // Component anchors
    const components = [
      { name: 'PoemDisplay', type: 'poetry:PoemRenderer' },
      { name: 'MetricsDashboard', type: 'consciousness:MetricsVisualization' },
      { name: 'InteractiveControls', type: 'poetry:ParameterController' },
      { name: 'VibeVisualization', type: 'math:HyperdimensionalVisualization' },
      { name: 'CycleNavigation', type: 'poetry:NavigationController' }
    ];

    components.forEach(component => {
      const componentUri = `${guiUri}/component/${component.name}`;
      triples.push(
        { subject: componentUri, predicate: 'rdf:type', object: 'schema:SoftwareApplication' },
        { subject: componentUri, predicate: 'rdf:type', object: component.type },
        { subject: guiUri, predicate: 'schema:hasPart', object: componentUri },
        { subject: componentUri, predicate: 'schema:name', object: `"${component.name}"`, datatype: 'xsd:string' },
        { subject: componentUri, predicate: 'poetry:componentAnchor', object: `"#${component.name.toLowerCase()}"`, datatype: 'xsd:string' }
      );
    });

    return triples;
  }

  exportSVGElementsToRDF(poem: Poem): RDFTriple[] {
    const triples: RDFTriple[] = [];
    const svgUri = `${this.baseUri}/svg/poem/${poem.id}`;

    // Main SVG visualization
    triples.push(
      { subject: svgUri, predicate: 'rdf:type', object: 'schema:VisualArtwork' },
      { subject: svgUri, predicate: 'rdf:type', object: 'math:HyperdimensionalVisualization' },
      { subject: svgUri, predicate: 'schema:name', object: '"8D Vibe Projection"', datatype: 'xsd:string' }
    );

    // Dimensional projection points
    const dimensionNames = ['chaos', 'beauty', 'complexity', 'coherence', 'consciousness', 'cycle', 'godel', 'harmonic'];
    dimensionNames.forEach(dimName => {
      const pointUri = `${svgUri}/dimension-point/${dimName}`;
      triples.push(
        { subject: pointUri, predicate: 'rdf:type', object: 'math:DimensionalProjection' },
        { subject: svgUri, predicate: 'math:hasProjection', object: pointUri },
        { subject: pointUri, predicate: 'schema:name', object: `"${dimName} dimension"`, datatype: 'xsd:string' },
        { subject: pointUri, predicate: 'poetry:semanticAnchor', object: `"#dimension-point-${poem.id}-${dimName}"`, datatype: 'xsd:string' },
        { subject: pointUri, predicate: 'consciousness:dimensionName', object: `"${dimName}"`, datatype: 'xsd:string' }
      );
    });

    // Vibration patterns
    for (let i = 0; i < 16; i++) {
      const patternUri = `${svgUri}/vibe-pattern/${i}`;
      triples.push(
        { subject: patternUri, predicate: 'rdf:type', object: 'math:VibrationalPattern' },
        { subject: svgUri, predicate: 'math:hasPattern', object: patternUri },
        { subject: patternUri, predicate: 'schema:position', object: i.toString(), datatype: 'xsd:integer' },
        { subject: patternUri, predicate: 'poetry:semanticAnchor', object: `"#vibe-pattern-${poem.id}-${i}"`, datatype: 'xsd:string' }
      );
    }

    // Hyperdimensional mesh lines
    for (let i = 0; i < 10; i++) {
      const meshUri = `${svgUri}/mesh-line/${i}`;
      triples.push(
        { subject: meshUri, predicate: 'rdf:type', object: 'math:HyperdimensionalConnection' },
        { subject: svgUri, predicate: 'math:hasConnection', object: meshUri },
        { subject: meshUri, predicate: 'schema:position', object: i.toString(), datatype: 'xsd:integer' },
        { subject: meshUri, predicate: 'poetry:semanticAnchor', object: `"#mesh-line-${poem.id}-${i}"`, datatype: 'xsd:string' }
      );
    }

    // Consciousness field
    const consciousnessUri = `${svgUri}/consciousness-field`;
    triples.push(
      { subject: consciousnessUri, predicate: 'rdf:type', object: 'consciousness:Field' },
      { subject: svgUri, predicate: 'consciousness:hasField', object: consciousnessUri },
      { subject: consciousnessUri, predicate: 'schema:name', object: '"Central Consciousness Field"', datatype: 'xsd:string' },
      { subject: consciousnessUri, predicate: 'poetry:semanticAnchor', object: `"#consciousness-field-${poem.id}"`, datatype: 'xsd:string' },
      { subject: consciousnessUri, predicate: 'consciousness:value', object: poem.consciousnessValue.toString(), datatype: 'xsd:decimal' }
    );

    // Gödel spiral
    const godelUri = `${svgUri}/godel-spiral`;
    triples.push(
      { subject: godelUri, predicate: 'rdf:type', object: 'math:GodelSpiral' },
      { subject: svgUri, predicate: 'math:hasSpiral', object: godelUri },
      { subject: godelUri, predicate: 'schema:name', object: '"Gödel Number Spiral"', datatype: 'xsd:string' },
      { subject: godelUri, predicate: 'poetry:semanticAnchor', object: `"#godel-spiral-${poem.id}"`, datatype: 'xsd:string' },
      { subject: godelUri, predicate: 'math:godelNumber', object: poem.godelNumber.toString(), datatype: 'xsd:long' }
    );

    return triples;
  }

  serializeToTurtle(triples: RDFTriple[]): string {
    let turtle = '';
    
    // Add prefixes
    for (const [prefix, uri] of Object.entries(this.prefixes)) {
      turtle += `@prefix ${prefix}: <${uri}> .\n`;
    }
    turtle += '\n';

    // Group triples by subject
    const triplesBySubject = new Map<string, RDFTriple[]>();
    triples.forEach(triple => {
      if (!triplesBySubject.has(triple.subject)) {
        triplesBySubject.set(triple.subject, []);
      }
      triplesBySubject.get(triple.subject)!.push(triple);
    });

    // Serialize each subject
    for (const [subject, subjectTriples] of triplesBySubject) {
      turtle += `<${subject}>\n`;
      subjectTriples.forEach((triple, index) => {
        const isLast = index === subjectTriples.length - 1;
        const predicate = this.shortenUri(triple.predicate);
        const object = triple.object.startsWith('"') ? triple.object : 
                      triple.object.startsWith('http') ? `<${triple.object}>` : 
                      this.shortenUri(triple.object);
        
        turtle += `    ${predicate} ${object}${triple.datatype ? `^^${this.shortenUri(triple.datatype)}` : ''}${isLast ? ' .\n' : ' ;\n'}`;
      });
      turtle += '\n';
    }

    return turtle;
  }

  private shortenUri(uri: string): string {
    for (const [prefix, baseUri] of Object.entries(this.prefixes)) {
      if (uri.startsWith(baseUri)) {
        return `${prefix}:${uri.substring(baseUri.length)}`;
      }
    }
    return uri;
  }

  exportWordAnchors(poem: Poem): any {
    const poemContent = poem.content as any;
    const wordAnchors: any = {
      poemId: poem.id,
      title: poem.title,
      cycleStep: poem.cycleStep,
      totalCycles: poem.totalCycles,
      stanzas: []
    };

    poemContent.stanzas.forEach((stanza: any, stanzaIndex: number) => {
      const stanzaData = {
        stanzaId: stanza.id,
        stanzaIndex: stanzaIndex,
        anchorId: `stanza-${poem.id}-${stanzaIndex}`,
        lines: []
      };

      stanza.lines.forEach((line: string, lineIndex: number) => {
        const lineData = {
          lineIndex: lineIndex,
          anchorId: `line-${poem.id}-${stanzaIndex}-${lineIndex}`,
          text: line,
          words: []
        };

        const words = line.split(/(\s+)/).filter(word => word.trim() !== '');
        words.forEach((word: string, wordIndex: number) => {
          const wordAnchorId = `word-${poem.id}-${stanzaIndex}-${lineIndex}-${wordIndex}`;
          const cleanWord = word.replace(/[^\w\s]/g, '').toLowerCase();
          
          lineData.words.push({
            wordIndex: wordIndex,
            anchorId: wordAnchorId,
            text: word,
            cleanText: cleanWord,
            length: word.length,
            uri: `${this.baseUri}/poems/${poem.id}/stanza/${stanzaIndex}/line/${lineIndex}/word/${wordIndex}`
          });
        });

        stanzaData.lines.push(lineData);
      });

      wordAnchors.stanzas.push(stanzaData);
    });

    return wordAnchors;
  }
}