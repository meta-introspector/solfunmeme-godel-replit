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

  useEffect(() => {
    setLocalGodelNumber(poem.godelNumber);
    setLocalChaosValue(poem.chaosValue);
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
            <Label className="text-sm font-medium text-cosmic-light/70">
              Gödel Number
            </Label>
            <Input
              type="text"
              value={localGodelNumber}
              onChange={(e) => handleGodelNumberChange(e.target.value)}
              disabled={isUpdating}
              className="w-full bg-cosmic-blue/30 border-cosmic-blue/50 text-cosmic-light font-mono 
                         focus:border-cosmic-cyan focus:ring-cosmic-cyan/20 
                         hover:bg-cosmic-blue/40 transition-all duration-300"
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

          {/* Cycle Navigation */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <Label className="text-sm font-medium text-cosmic-light/70">
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
