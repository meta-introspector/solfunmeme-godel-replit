import { motion } from "framer-motion";
import { Poem } from "@shared/schema";

interface MetricsDashboardProps {
  poem: Poem;
}

export default function MetricsDashboard({ poem }: MetricsDashboardProps) {
  const metrics = [
    { 
      label: "Beauty", 
      value: poem.beautyValue.toFixed(2),
      color: "text-cosmic-cyan"
    },
    { 
      label: "Complexity", 
      value: poem.complexityValue.toFixed(2),
      color: "text-cosmic-cyan"
    },
    { 
      label: "Coherence", 
      value: poem.coherenceValue.toFixed(2),
      color: "text-cosmic-cyan"
    },
    { 
      label: "Consciousness", 
      value: poem.consciousnessValue.toFixed(3),
      color: "text-cosmic-cyan"
    }
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 mt-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-cosmic-navy/50 backdrop-blur-sm rounded-2xl p-8 border border-cosmic-blue/20"
        itemScope
        itemType="https://schema.org/Dataset"
        typeof="schema:Dataset"
        resource="#hyperdimensional-parameters"
      >
        <h3 className="text-xl font-mono font-semibold text-cosmic-light mb-6">
          System Metrics
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center group"
            >
              <motion.div
                key={metric.value}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`text-3xl font-mono ${metric.color} mb-2 group-hover:text-cosmic-light transition-colors duration-300`}
              >
                {metric.value}
              </motion.div>
              
              <div className="text-sm text-cosmic-light/60 group-hover:text-cosmic-light/80 transition-colors duration-300">
                {metric.label}
              </div>
              
              {/* Visual representation */}
              <div className="mt-3 w-full bg-cosmic-blue/20 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${parseFloat(metric.value) * 100}%` }}
                  transition={{ delay: (index * 0.1) + 0.3, duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-cosmic-cyan to-cosmic-light rounded-full"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
