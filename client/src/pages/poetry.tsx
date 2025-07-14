import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Poem } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import PoemDisplay from "@/components/PoemDisplay";
import InteractiveControls from "@/components/InteractiveControls";
import MetricsDashboard from "@/components/MetricsDashboard";
import { useToast } from "@/hooks/use-toast";

export default function Poetry() {
  const [currentPoemId, setCurrentPoemId] = useState(1);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: poem, isLoading, error } = useQuery<Poem>({
    queryKey: ["/api/poems", currentPoemId],
    enabled: !!currentPoemId,
  });

  const updatePoemMutation = useMutation({
    mutationFn: async (updates: Partial<Poem>) => {
      const response = await apiRequest("PATCH", `/api/poems/${currentPoemId}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/poems", currentPoemId] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update poem parameters",
        variant: "destructive",
      });
    },
  });

  const handleParameterUpdate = (updates: Partial<Poem>) => {
    updatePoemMutation.mutate(updates);
  };

  const handleCycleChange = (direction: "prev" | "next") => {
    if (!poem) return;
    
    const newStep = direction === "next" 
      ? Math.min(poem.cycleStep + 1, poem.totalCycles)
      : Math.max(poem.cycleStep - 1, 1);
    
    // For demo purposes, we'll just update the current poem's cycle step
    // In a real app, you'd fetch different poems for different cycles
    handleParameterUpdate({ cycleStep: newStep });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cosmic-black flex items-center justify-center">
        <div className="text-cosmic-light text-lg">Loading poetry...</div>
      </div>
    );
  }

  if (error || !poem) {
    return (
      <div className="min-h-screen bg-cosmic-black flex items-center justify-center">
        <div className="text-cosmic-light text-lg">Failed to load poem</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cosmic-black text-cosmic-white">
      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 w-full bg-cosmic-black/80 backdrop-blur-sm z-50 border-b border-cosmic-blue/30"
      >
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-3 h-3 bg-cosmic-cyan rounded-full"
              />
              <h1 className="text-xl font-mono font-bold text-cosmic-light">
                Cycle Step {poem.cycleStep} of {poem.totalCycles}
              </h1>
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-sm text-cosmic-light/60">Phase 2</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-cosmic-light/60">Consciousness:</span>
                <span className="font-mono text-cosmic-cyan">{poem.consciousnessValue}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="pt-20 pb-12">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto px-4 py-12"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-poetry font-bold text-cosmic-light mb-4">
              {poem.title}
            </h2>
            <p className="text-lg text-cosmic-light/70 max-w-2xl mx-auto">
              An interactive journey through Gödel's numbers and consciousness cycles
            </p>
          </div>
        </motion.section>

        {/* Interactive Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <InteractiveControls
            poem={poem}
            onParameterUpdate={handleParameterUpdate}
            onCycleChange={handleCycleChange}
            isUpdating={updatePoemMutation.isPending}
          />
        </motion.div>

        {/* Poetry Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <PoemDisplay 
            poem={poem} 
            onNumberClick={handleParameterUpdate}
          />
        </motion.div>

        {/* Metrics Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <MetricsDashboard poem={poem} />
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 py-8 text-center text-cosmic-light/40">
        <p className="font-mono text-sm">
          A journey through the mathematics of consciousness and creativity
        </p>
      </footer>
    </div>
  );
}
