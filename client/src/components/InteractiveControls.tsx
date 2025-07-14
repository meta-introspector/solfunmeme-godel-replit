import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Poem } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface InteractiveControlsProps {
  poem: Poem;
  onParameterUpdate: (updates: Partial<Poem>) => void;
  onCycleChange: (direction: "prev" | "next") => void;
  isUpdating: boolean;
}

export default function InteractiveControls({
  poem,
  onParameterUpdate,
  onCycleChange,
  isUpdating
}: InteractiveControlsProps) {
  const [localGodelNumber, setLocalGodelNumber] = useState(poem.godelNumber);
  const [localChaosValue, setLocalChaosValue] = useState(poem.chaosValue);
  const [localBeautyValue, setLocalBeautyValue] = useState(poem.beautyValue);
  const [localComplexityValue, setLocalComplexityValue] = useState(poem.complexityValue);
  const [localCoherenceValue, setLocalCoherenceValue] = useState(poem.coherenceValue);
  const [localConsciousnessValue, setLocalConsciousnessValue] = useState(poem.consciousnessValue);

  useEffect(() => {
    setLocalGodelNumber(poem.godelNumber);
    setLocalChaosValue(poem.chaosValue);
    setLocalBeautyValue(poem.beautyValue);
    setLocalComplexityValue(poem.complexityValue);
    setLocalCoherenceValue(poem.coherenceValue);
    setLocalConsciousnessValue(poem.consciousnessValue);
  }, [poem]);

  const handleGodelNumberChange = (value: string) => {
    setLocalGodelNumber(value);
    onParameterUpdate({ godelNumber: value });
  };

  const handleChaosValueChange = (value: number[]) => {
    const newValue = value[0];
    setLocalChaosValue(newValue);
    onParameterUpdate({ chaosValue: newValue });
  };

  const handleBeautyValueChange = (value: number[]) => {
    const newValue = value[0];
    setLocalBeautyValue(newValue);
    onParameterUpdate({ beautyValue: newValue });
  };

  const handleComplexityValueChange = (value: number[]) => {
    const newValue = value[0];
    setLocalComplexityValue(newValue);
    onParameterUpdate({ complexityValue: newValue });
  };

  const handleCoherenceValueChange = (value: number[]) => {
    const newValue = value[0];
    setLocalCoherenceValue(newValue);
    onParameterUpdate({ coherenceValue: newValue });
  };

  const handleConsciousnessValueChange = (value: number[]) => {
    const newValue = value[0];
    setLocalConsciousnessValue(newValue);
    onParameterUpdate({ consciousnessValue: newValue });
  };

  return (
    <section className="max-w-6xl mx-auto px-4 mb-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-cosmic-navy/50 backdrop-blur-sm rounded-2xl p-8 border border-cosmic-blue/20"
      >
        <h3 className="text-xl font-mono font-semibold text-cosmic-light mb-6">
          Interactive Parameters
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Gödel Number Input */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            <Label className="text-sm font-medium text-cosmic-light font-semibold">
              Gödel Number
            </Label>
            <Input
              type="text"
              value={localGodelNumber}
              onChange={(e) => handleGodelNumberChange(e.target.value)}
              disabled={isUpdating}
              className="w-full bg-cosmic-blue/40 border-cosmic-cyan/50 text-cosmic-light font-mono font-semibold
                         focus:border-cosmic-cyan focus:ring-cosmic-cyan/30 
                         hover:bg-cosmic-blue/50 transition-all duration-300
                         placeholder:text-cosmic-light/50"
              placeholder="Enter Gödel number..."
            />
          </motion.div>

          {/* Chaos Value Slider */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <Label className="text-sm font-medium text-cosmic-light/70">
              Chaos Value
            </Label>
            <div className="px-3">
              <Slider
                value={[localChaosValue]}
                onValueChange={handleChaosValueChange}
                max={1}
                min={0}
                step={0.01}
                disabled={isUpdating}
                className="w-full"
              />
            </div>
            <div className="text-center">
              <motion.span 
                key={localChaosValue}
                initial={{ scale: 1.2, color: "#3282b8" }}
                animate={{ scale: 1, color: "#3282b8" }}
                className="font-mono text-cosmic-cyan"
              >
                {localChaosValue.toFixed(2)}
              </motion.span>
            </div>
          </motion.div>

          {/* Beauty Value Slider */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <Label className="text-sm font-medium text-cosmic-light/70">
              Beauty Value
            </Label>
            <div className="px-3">
              <Slider
                value={[localBeautyValue]}
                onValueChange={handleBeautyValueChange}
                max={1}
                min={0}
                step={0.01}
                disabled={isUpdating}
                className="w-full"
              />
            </div>
            <div className="text-center">
              <motion.span 
                key={localBeautyValue}
                initial={{ scale: 1.2, color: "#3282b8" }}
                animate={{ scale: 1, color: "#3282b8" }}
                className="font-mono text-cosmic-cyan"
              >
                {localBeautyValue.toFixed(2)}
              </motion.span>
            </div>
          </motion.div>
        </div>

        {/* Second row of sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Complexity Value Slider */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            <Label className="text-sm font-medium text-cosmic-light/70">
              Complexity Value
            </Label>
            <div className="px-3">
              <Slider
                value={[localComplexityValue]}
                onValueChange={handleComplexityValueChange}
                max={1}
                min={0}
                step={0.01}
                disabled={isUpdating}
                className="w-full"
              />
            </div>
            <div className="text-center">
              <motion.span 
                key={localComplexityValue}
                initial={{ scale: 1.2, color: "#3282b8" }}
                animate={{ scale: 1, color: "#3282b8" }}
                className="font-mono text-cosmic-cyan"
              >
                {localComplexityValue.toFixed(2)}
              </motion.span>
            </div>
          </motion.div>

          {/* Coherence Value Slider */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-3"
          >
            <Label className="text-sm font-medium text-cosmic-light/70">
              Coherence Value
            </Label>
            <div className="px-3">
              <Slider
                value={[localCoherenceValue]}
                onValueChange={handleCoherenceValueChange}
                max={1}
                min={0}
                step={0.01}
                disabled={isUpdating}
                className="w-full"
              />
            </div>
            <div className="text-center">
              <motion.span 
                key={localCoherenceValue}
                initial={{ scale: 1.2, color: "#3282b8" }}
                animate={{ scale: 1, color: "#3282b8" }}
                className="font-mono text-cosmic-cyan"
              >
                {localCoherenceValue.toFixed(2)}
              </motion.span>
            </div>
          </motion.div>

          {/* Consciousness Value Slider */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-3"
          >
            <Label className="text-sm font-medium text-cosmic-light/70">
              Consciousness Value
            </Label>
            <div className="px-3">
              <Slider
                value={[localConsciousnessValue]}
                onValueChange={handleConsciousnessValueChange}
                max={1}
                min={0}
                step={0.001}
                disabled={isUpdating}
                className="w-full"
              />
            </div>
            <div className="text-center">
              <motion.span 
                key={localConsciousnessValue}
                initial={{ scale: 1.2, color: "#3282b8" }}
                animate={{ scale: 1, color: "#3282b8" }}
                className="font-mono text-cosmic-cyan"
              >
                {localConsciousnessValue.toFixed(3)}
              </motion.span>
            </div>
          </motion.div>
        </div>

        {/* Cycle Navigation - separate section */}
        <div className="mt-8 flex justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-cosmic-blue/20 rounded-lg p-6"
          >
            <Label className="text-sm font-medium text-cosmic-light/70 block text-center mb-4">
              Current Cycle
            </Label>
            <div className="flex items-center justify-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCycleChange("prev")}
                disabled={isUpdating || poem.cycleStep <= 1}
                className="bg-cosmic-blue/50 hover:bg-cosmic-blue/70 text-cosmic-light 
                          border border-cosmic-blue/30 hover:border-cosmic-cyan/50 
                          transition-all duration-300"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              
              <motion.div
                key={poem.cycleStep}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center space-x-2"
              >
                <span className="font-mono text-2xl text-cosmic-cyan">
                  {poem.cycleStep}
                </span>
                <span className="text-cosmic-light/60">of {poem.totalCycles}</span>
              </motion.div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCycleChange("next")}
                disabled={isUpdating || poem.cycleStep >= poem.totalCycles}
                className="bg-cosmic-blue/50 hover:bg-cosmic-blue/70 text-cosmic-light 
                          border border-cosmic-blue/30 hover:border-cosmic-cyan/50 
                          transition-all duration-300"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
