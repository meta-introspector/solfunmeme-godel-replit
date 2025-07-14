import { useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Poem } from "@shared/schema";

interface VibeVisualizationProps {
  poem: Poem;
}

export default function VibeVisualization({ poem }: VibeVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  // Project 8D parameters into 2D coordinates
  const project8DTo2D = useMemo(() => {
    const params = [
      poem.chaosValue,
      poem.beautyValue,
      poem.complexityValue,
      poem.coherenceValue,
      poem.consciousnessValue,
      poem.cycleStep / poem.totalCycles,
      parseInt(poem.godelNumber) % 1000 / 1000,
      Math.sin(poem.cycleStep * 0.1) * 0.5 + 0.5
    ];

    const centerX = 200;
    const centerY = 200;
    const radius = 150;

    // Use rotation matrices and dimensional reduction
    const points = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const x = centerX + Math.cos(angle) * radius * params[i];
      const y = centerY + Math.sin(angle) * radius * params[i];
      points.push({ x, y, value: params[i] });
    }

    return points;
  }, [poem]);

  // Generate vibration patterns
  const vibePatterns = useMemo(() => {
    const patterns = [];
    const frequency = poem.chaosValue * 10;
    const amplitude = poem.beautyValue * 20;
    
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const radius = 50 + poem.complexityValue * 100;
      const x = 200 + Math.cos(angle) * radius;
      const y = 200 + Math.sin(angle) * radius;
      
      patterns.push({
        x,
        y,
        frequency: frequency + i * 0.5,
        amplitude: amplitude * (0.5 + Math.random() * 0.5),
        phase: i * Math.PI / 8
      });
    }
    
    return patterns;
  }, [poem]);

  // Create hyperdimensional mesh
  const hypermesh = useMemo(() => {
    const mesh = [];
    const dimensions = [
      poem.chaosValue,
      poem.beautyValue,
      poem.complexityValue,
      poem.coherenceValue,
      poem.consciousnessValue
    ];

    for (let i = 0; i < dimensions.length; i++) {
      for (let j = i + 1; j < dimensions.length; j++) {
        const x1 = 50 + i * 60;
        const y1 = 50 + dimensions[i] * 300;
        const x2 = 50 + j * 60;
        const y2 = 50 + dimensions[j] * 300;
        
        mesh.push({
          x1, y1, x2, y2,
          opacity: (dimensions[i] + dimensions[j]) / 2,
          color: `hsl(${(i + j) * 60}, 70%, 50%)`
        });
      }
    }

    return mesh;
  }, [poem]);

  return (
    <section className="max-w-4xl mx-auto px-4 mt-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-cosmic-navy/30 backdrop-blur-sm rounded-2xl p-8 border border-cosmic-blue/20"
      >
        <h3 className="text-xl font-mono font-semibold text-cosmic-light mb-6 text-center">
          8D Vibe Projection
        </h3>
        
        <div className="flex justify-center">
          <motion.svg
            ref={svgRef}
            width="400"
            height="400"
            viewBox="0 0 400 400"
            className="border border-cosmic-blue/30 rounded-lg"
            style={{ background: "radial-gradient(circle at center, #1a1a2e 0%, #16213e 100%)" }}
          >
            {/* Background grid */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(50, 130, 184, 0.1)" strokeWidth="1"/>
              </pattern>
              
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            <rect width="400" height="400" fill="url(#grid)" />
            
            {/* Hyperdimensional mesh */}
            {hypermesh.map((line, index) => (
              <motion.line
                key={`mesh-${index}`}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke={line.color}
                strokeWidth="2"
                opacity={line.opacity}
                filter="url(#glow)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: index * 0.1 }}
              />
            ))}
            
            {/* 8D projection points */}
            {project8DTo2D.map((point, index) => (
              <motion.circle
                key={`point-${index}`}
                cx={point.x}
                cy={point.y}
                r={5 + point.value * 10}
                fill={`hsl(${180 + index * 30}, 70%, 60%)`}
                filter="url(#glow)"
                animate={{
                  r: [5 + point.value * 10, 8 + point.value * 12, 5 + point.value * 10],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{
                  duration: 2 + point.value,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
            
            {/* Vibration patterns */}
            {vibePatterns.map((pattern, index) => (
              <motion.circle
                key={`vibe-${index}`}
                cx={pattern.x}
                cy={pattern.y}
                r="3"
                fill="none"
                stroke="rgba(50, 130, 184, 0.8)"
                strokeWidth="1"
                animate={{
                  r: [3, 3 + pattern.amplitude / 10, 3],
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{
                  duration: 1 / pattern.frequency,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: pattern.phase
                }}
              />
            ))}
            
            {/* Central consciousness field */}
            <motion.circle
              cx="200"
              cy="200"
              r={poem.consciousnessValue * 80}
              fill="none"
              stroke="rgba(187, 225, 250, 0.6)"
              strokeWidth="2"
              strokeDasharray="5,5"
              animate={{
                r: [poem.consciousnessValue * 80, poem.consciousnessValue * 90, poem.consciousnessValue * 80],
                rotate: [0, 360]
              }}
              transition={{
                r: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 10, repeat: Infinity, ease: "linear" }
              }}
            />
            
            {/* Gödel spiral */}
            <motion.path
              d={`M 200 200 ${Array.from({ length: 50 }, (_, i) => {
                const angle = (i / 50) * Math.PI * 6;
                const radius = (i / 50) * (parseInt(poem.godelNumber) % 100);
                const x = 200 + Math.cos(angle) * radius;
                const y = 200 + Math.sin(angle) * radius;
                return `L ${x} ${y}`;
              }).join(' ')}`}
              fill="none"
              stroke="rgba(50, 130, 184, 0.5)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* Chaos field */}
            <motion.rect
              x="180"
              y="180"
              width="40"
              height="40"
              fill="none"
              stroke="rgba(255, 100, 100, 0.6)"
              strokeWidth="1"
              animate={{
                rotate: [0, 360],
                scale: [1, 1 + poem.chaosValue, 1]
              }}
              transition={{
                rotate: { duration: 5, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            />
            
            {/* Dimension labels */}
            <text x="20" y="30" fill="rgba(187, 225, 250, 0.7)" fontSize="12" fontFamily="monospace">
              Chaos: {poem.chaosValue.toFixed(2)}
            </text>
            <text x="20" y="50" fill="rgba(187, 225, 250, 0.7)" fontSize="12" fontFamily="monospace">
              Beauty: {poem.beautyValue.toFixed(2)}
            </text>
            <text x="20" y="70" fill="rgba(187, 225, 250, 0.7)" fontSize="12" fontFamily="monospace">
              Complexity: {poem.complexityValue.toFixed(2)}
            </text>
            <text x="20" y="90" fill="rgba(187, 225, 250, 0.7)" fontSize="12" fontFamily="monospace">
              Coherence: {poem.coherenceValue.toFixed(2)}
            </text>
            <text x="20" y="110" fill="rgba(187, 225, 250, 0.7)" fontSize="12" fontFamily="monospace">
              Consciousness: {poem.consciousnessValue.toFixed(3)}
            </text>
            
            {/* Cycle indicator */}
            <text x="200" y="380" fill="rgba(50, 130, 184, 0.8)" fontSize="14" fontFamily="monospace" textAnchor="middle">
              Cycle {poem.cycleStep} / {poem.totalCycles}
            </text>
          </motion.svg>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-cosmic-light/60 font-mono">
            Hyperdimensional consciousness field vibrating at {poem.chaosValue.toFixed(2)} Hz
          </p>
          <p className="text-sm text-cosmic-light/60 font-mono mt-2">
            Gödel resonance: {poem.godelNumber}
          </p>
        </div>
      </motion.div>
    </section>
  );
}