import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Poem, PoemContent, InteractiveNumber } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PoemDisplayProps {
  poem: Poem;
  onNumberClick: (updates: Partial<Poem>) => void;
}

export default function PoemDisplay({ poem, onNumberClick }: PoemDisplayProps) {
  const [editingNumber, setEditingNumber] = useState<{ 
    stanzaId: string; 
    numberIndex: number; 
    value: string 
  } | null>(null);

  const content = poem.content as PoemContent;

  const handleInteractiveNumberClick = (
    stanzaId: string,
    numberIndex: number,
    interactiveNumber: InteractiveNumber
  ) => {
    setEditingNumber({
      stanzaId,
      numberIndex,
      value: interactiveNumber.value
    });
  };

  const handleNumberUpdate = (newValue: string) => {
    if (!editingNumber) return;
    
    const updates: Partial<Poem> = {};
    
    // Find the interactive number being edited
    const stanza = content.stanzas.find(s => s.id === editingNumber.stanzaId);
    if (stanza) {
      const interactiveNum = stanza.interactiveNumbers[editingNumber.numberIndex];
      if (interactiveNum?.binding) {
        // Update the bound property
        switch (interactiveNum.binding) {
          case "godelNumber":
            updates.godelNumber = newValue;
            break;
          case "chaosValue":
            updates.chaosValue = parseFloat(newValue);
            break;
          case "beautyValue":
            updates.beautyValue = parseFloat(newValue);
            break;
          case "complexityValue":
            updates.complexityValue = parseFloat(newValue);
            break;
          case "coherenceValue":
            updates.coherenceValue = parseFloat(newValue);
            break;
          case "consciousnessValue":
            updates.consciousnessValue = parseFloat(newValue);
            break;
          case "totalCycles":
            updates.totalCycles = parseInt(newValue);
            break;
          case "cycleStep":
            updates.cycleStep = parseInt(newValue);
            break;
        }
      }
    }
    
    onNumberClick(updates);
    setEditingNumber(null);
  };

  const getCurrentValueForBinding = (binding: string) => {
    switch (binding) {
      case "godelNumber":
        return poem.godelNumber;
      case "chaosValue":
        return poem.chaosValue.toFixed(2);
      case "beautyValue":
        return poem.beautyValue.toFixed(2);
      case "complexityValue":
        return poem.complexityValue.toFixed(2);
      case "coherenceValue":
        return poem.coherenceValue.toFixed(2);
      case "consciousnessValue":
        return poem.consciousnessValue.toFixed(3);
      case "totalCycles":
        return poem.totalCycles.toString();
      case "cycleStep":
        return poem.cycleStep.toString();
      default:
        return "";
    }
  };

  const renderLineWithInteractiveNumbers = (line: string, stanza: any) => {
    let result = line;
    const interactiveNumbers = stanza.interactiveNumbers || [];
    
    // Sort by length (longest first) to avoid partial replacements
    const sortedNumbers = [...interactiveNumbers].sort((a, b) => b.value.length - a.value.length);
    
    sortedNumbers.forEach((num, index) => {
      const isEditing = editingNumber?.stanzaId === stanza.id && 
                       editingNumber?.numberIndex === index;
      
      // Get current value from poem state if bound, otherwise use original value
      const currentValue = num.binding ? getCurrentValueForBinding(num.binding) : num.value;
      
      if (isEditing) {
        result = result.replace(
          num.value,
          `<EDITING_${index}>`
        );
      } else {
        result = result.replace(
          num.value,
          `<INTERACTIVE_${index}>`
        );
      }
    });
    
    // Split and render
    const parts = result.split(/(<[^>]+>)/);
    
    return parts.map((part, partIndex) => {
      const editingMatch = part.match(/^<EDITING_(\d+)>$/);
      const interactiveMatch = part.match(/^<INTERACTIVE_(\d+)>$/);
      
      if (editingMatch) {
        const numIndex = parseInt(editingMatch[1]);
        return (
          <span key={partIndex} className="inline-block">
            <Input
              value={editingNumber?.value || ""}
              onChange={(e) => setEditingNumber(prev => prev ? { ...prev, value: e.target.value } : null)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleNumberUpdate(editingNumber?.value || "");
                } else if (e.key === 'Escape') {
                  setEditingNumber(null);
                }
              }}
              onBlur={() => handleNumberUpdate(editingNumber?.value || "")}
              className="w-auto min-w-20 h-auto p-1 text-cosmic-cyan font-mono bg-cosmic-blue/30 border-cosmic-cyan inline-block"
              autoFocus
            />
          </span>
        );
      }
      
      if (interactiveMatch) {
        const numIndex = parseInt(interactiveMatch[1]);
        const interactiveNum = interactiveNumbers[numIndex];
        const currentValue = interactiveNum.binding ? getCurrentValueForBinding(interactiveNum.binding) : interactiveNum.value;
        
        return (
          <motion.span
            key={`${partIndex}-${currentValue}`}
            initial={{ scale: 1.1, color: "#3282b8" }}
            animate={{ scale: 1, color: "#3282b8" }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="interactive-number font-mono text-cosmic-cyan cursor-pointer hover:text-cosmic-light transition-colors"
            onClick={() => handleInteractiveNumberClick(stanza.id, numIndex, interactiveNum)}
          >
            {currentValue}
          </motion.span>
        );
      }
      
      return part;
    });
  };

  return (
    <section className="max-w-4xl mx-auto px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-cosmic-navy/30 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-cosmic-blue/20"
        itemScope
        itemType="https://schema.org/CreativeWork"
        typeof="schema:CreativeWork"
        resource={`#poem-${poem.id}`}
      >
        <div className="space-y-8 font-poetry text-lg md:text-xl leading-relaxed">
          <AnimatePresence mode="wait">
            {content.stanzas.map((stanza, index) => (
              <motion.div
                key={stanza.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className={`space-y-4 ${stanza.hasLeftBorder ? 'border-l-2 border-cosmic-blue/30 pl-6' : ''}`}
              >
                {stanza.lines.map((line, lineIndex) => (
                  <motion.p
                    key={lineIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: (index * 0.1) + (lineIndex * 0.05) }}
                    className="poetry-line hover:text-cosmic-light transition-colors duration-300"
                  >
                    {renderLineWithInteractiveNumbers(line, stanza)}
                  </motion.p>
                ))}
              </motion.div>
            ))}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-center space-y-4 pt-8"
          >
            {content.endMessage.split('\n').map((line, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 + (index * 0.1) }}
                className={`poetry-line ${line.includes('===') ? 'text-sm text-cosmic-light/60 font-mono' : 'text-2xl'}`}
              >
                {line.includes('is') ? (
                  <>
                    The message <em>is</em> the vibe <em>is</em> the function,
                  </>
                ) : (
                  line
                )}
              </motion.p>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
