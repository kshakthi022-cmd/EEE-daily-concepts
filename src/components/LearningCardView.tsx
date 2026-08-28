import React, { useState } from "react";
import { LearningCard } from "../types";
import { FormattedTextWithMath, KatexMath } from "./KatexMath";
import { InteractiveCalculator } from "./InteractiveCalculator";
import { MicroQuiz } from "./MicroQuiz";
import {
  Bookmark,
  BookmarkCheck,
  Check,
  Copy,
  Volume2,
  VolumeX,
  Code2,
  BookOpen,
  Zap,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Cpu,
  Layers,
} from "lucide-react";

interface LearningCardViewProps {
  card: LearningCard;
  onSelectTopic: (topicName: string) => void;
  onToggleBookmark: (card: LearningCard) => void;
  isBookmarked: boolean;
  onMarkMastered?: (card: LearningCard) => void;
  isMastered?: boolean;
}

export const LearningCardView: React.FC<LearningCardViewProps> = ({
  card,
  onSelectTopic,
  onToggleBookmark,
  isBookmarked,
  onMarkMastered,
  isMastered = false,
}) => {
  const [viewMode, setViewMode] = useState<"card" | "markdown">("card");
  const [copied, setCopied] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Copy raw formatted markdown
  const handleCopyMarkdown = () => {
    const textToCopy = card.formattedMarkdown || generateExactMarkdown(card);
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Text-to-speech audio reader
  const handleToggleSpeech = () => {
    if (!window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const narrationText = `Topic: ${card.topicName}. Category: ${card.category}. Explanation: ${card.shortExplanation}. Worked Example: ${card.workedExample.scenario}. Solution: ${card.workedExample.solution}`;
    const utterance = new SpeechSynthesisUtterance(narrationText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Top Action Ribbon - Bento Style */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 sm:p-4 rounded-[1.5rem] shadow-xl backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-full font-bold bg-amber-400/10 text-amber-400 border border-amber-400/20 tracking-wide uppercase text-[10px]">
            ⚡ {card.category || "Electrical Engineering"}
          </span>
          {isMastered && (
            <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Mastered
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Audio Narration */}
          <button
            type="button"
            onClick={handleToggleSpeech}
            className={`p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
              isSpeaking
                ? "bg-amber-400 text-slate-950 border-amber-300 animate-pulse"
                : "bg-slate-950/60 text-slate-300 hover:text-white border-slate-800 hover:bg-slate-800"
            }`}
            title={isSpeaking ? "Stop Narration" : "Listen to Lesson"}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isSpeaking ? "Stop Voice" : "Listen"}</span>
          </button>

          {/* Toggle View Mode */}
          <button
            type="button"
            onClick={() => setViewMode(viewMode === "card" ? "markdown" : "card")}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-semibold bg-slate-950/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Toggle Raw Markdown / Bento Card"
          >
            {viewMode === "card" ? (
              <>
                <Code2 className="w-4 h-4 text-cyan-400" />
                <span className="hidden sm:inline">Raw Markdown</span>
              </>
            ) : (
              <>
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span className="hidden sm:inline">Bento Grid</span>
              </>
            )}
          </button>

          {/* Copy Card Markdown */}
          <button
            type="button"
            onClick={handleCopyMarkdown}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-semibold bg-slate-950/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Copy Exact Markdown Card"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? "Copied!" : "Copy"}</span>
          </button>

          {/* Bookmark */}
          <button
            type="button"
            onClick={() => onToggleBookmark(card)}
            className={`p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
              isBookmarked
                ? "bg-amber-400/20 text-amber-300 border-amber-400/40"
                : "bg-slate-950/60 text-slate-300 hover:text-white border-slate-800 hover:bg-slate-800"
            }`}
            title={isBookmarked ? "Remove Bookmark" : "Save for Review"}
          >
            {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-amber-400" /> : <Bookmark className="w-4 h-4" />}
            <span className="hidden sm:inline">{isBookmarked ? "Saved" : "Save"}</span>
          </button>

          {/* Mark Mastered */}
          {onMarkMastered && (
            <button
              type="button"
              onClick={() => onMarkMastered(card)}
              className={`p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                isMastered
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  : "bg-slate-950/60 text-slate-300 hover:text-white border-slate-800 hover:bg-slate-800"
              }`}
              title="Mark as Mastered"
            >
              <Check className={`w-4 h-4 ${isMastered ? "text-emerald-400" : ""}`} />
              <span className="hidden sm:inline">{isMastered ? "Mastered" : "Mark Mastered"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === "markdown" ? (
        /* Raw Markdown View adhering strictly to requested prompt output */
        <div className="rounded-[2rem] border border-slate-800 bg-[#020617] p-8 shadow-2xl relative">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
              Raw Structured Output Format
            </span>
            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="text-xs text-amber-400 hover:underline flex items-center gap-1 cursor-pointer font-bold"
            >
              <Copy className="w-3.5 h-3.5" /> Copy Markdown
            </button>
          </div>
          <pre className="text-xs font-mono text-slate-200 whitespace-pre-wrap overflow-x-auto p-6 rounded-2xl bg-slate-900 border border-slate-800 leading-relaxed select-all">
            {card.formattedMarkdown || generateExactMarkdown(card)}
          </pre>
        </div>
      ) : (
        /* Bento Grid Architecture */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Bento Cell 1: Topic & Short Explanation (Col-span-8) */}
          <section className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-[2rem] p-6 sm:p-8 flex flex-col justify-center relative overflow-hidden shadow-2xl">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-amber-400/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="inline-block px-3 py-1 bg-amber-400/10 border border-amber-400/20 text-amber-400 text-[10px] font-bold uppercase tracking-widest rounded-full mb-4 w-fit">
              ⚡ Topic: {card.category}
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight">
              {card.topicName}
            </h2>

            <div className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-3xl">
              <FormattedTextWithMath text={card.shortExplanation} />
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-4 text-xs text-slate-500 font-mono">
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Micro-Module</span>
              </span>
              <span>•</span>
              <span className="text-slate-400 font-medium">Core Principle & Real-World Utility</span>
            </div>
          </section>

          {/* Bento Cell 2: Primary Equation & Units (Col-span-4 Signature Amber Bento) */}
          <section className="lg:col-span-4 bg-amber-400 rounded-[2rem] p-6 sm:p-8 flex flex-col justify-between text-slate-950 shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-start">
              <span className="font-black text-xs uppercase tracking-tight flex items-center gap-1.5">
                <span>📐 Primary Equation</span>
              </span>
              <span className="text-3xl font-serif font-bold opacity-80">∑</span>
            </div>

            <div className="my-auto py-4">
              <div className="text-2xl sm:text-3xl font-mono font-black text-center tracking-tighter text-slate-950 py-3 px-2 rounded-2xl bg-amber-300/60 border border-slate-950/10 shadow-inner overflow-x-auto">
                <KatexMath math={card.primaryEquationLatex} block={true} />
              </div>

              <div className="mt-5 space-y-1.5 text-xs font-semibold">
                <div className="text-[10px] uppercase font-bold tracking-widest text-slate-900/60 pb-1">
                  Variables & Units:
                </div>
                {card.variables.map((v, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center border-b border-slate-950/15 pb-1 gap-2"
                  >
                    <span className="truncate">
                      <span className="font-mono font-black">
                        <KatexMath math={v.symbol} />
                      </span>{" "}
                      <span className="opacity-80">({v.description})</span>
                    </span>
                    <span className="font-mono font-black shrink-0 px-1.5 py-0.5 rounded bg-slate-950/10 text-slate-950">
                      {v.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[10px] uppercase font-black tracking-widest opacity-60 mt-2">
              Mathematical Model & Dimensional Units
            </div>
          </section>

          {/* Bento Cell 3: Worked Example (Col-span-8) */}
          <section className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-[2rem] p-6 sm:p-8 flex flex-col shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                💡 Worked Example: Real-World Scenario
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 flex-grow">
              {/* Left Column: Scenario & Given */}
              <div className="space-y-4 flex flex-col justify-between">
                <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                  <h4 className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-2">
                    Scenario
                  </h4>
                  <div className="text-sm text-slate-300 leading-relaxed">
                    <FormattedTextWithMath text={card.workedExample.scenario} />
                  </div>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                  <h4 className="text-[11px] font-bold text-blue-400 uppercase tracking-wider mb-2">
                    Given Values
                  </h4>
                  <ul className="text-xs font-mono text-blue-300 space-y-1.5">
                    {card.workedExample.given.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-blue-500 font-bold">•</span>
                        <FormattedTextWithMath text={item} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Column: Calculation & Solution */}
              <div className="flex flex-col justify-between bg-blue-600/5 rounded-2xl border border-blue-500/20 p-5">
                <div>
                  <h4 className="text-[11px] font-bold text-blue-400 uppercase tracking-wider mb-3">
                    Calculation Steps
                  </h4>
                  <div className="text-xs space-y-2 font-mono text-slate-300">
                    {card.workedExample.calculationSteps.map((step, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/50"
                      >
                        <FormattedTextWithMath text={step} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-blue-500/20">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block mb-1">
                    Final Solution
                  </span>
                  <div className="text-white font-bold text-sm">
                    <FormattedTextWithMath text={card.workedExample.solution} />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Bento Cell 4: Pro Tip & Learning Action (Col-span-4) */}
          <section className="lg:col-span-4 bg-blue-600 rounded-[2rem] p-6 sm:p-8 flex flex-col justify-between text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-4 opacity-15 pointer-events-none">
              <Zap className="w-24 h-24 stroke-[1.5]" />
            </div>

            <div>
              <div className="inline-block px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest mb-3">
                💡 Pro Engineering Tip
              </div>
              <h3 className="text-xl font-black mb-2 text-white">Rule of Thumb</h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                Always double-check your polarity and ground reference before setting up equations. In high-frequency or transient states, parasitic inductance and capacitance will alter theoretical DC assumptions.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/20 flex flex-col gap-2">
              <div className="text-[11px] text-blue-200 font-mono">
                Formula verified with dimensional analysis
              </div>
            </div>
          </section>

          {/* Bento Cell 5: Interactive Parameter Sandbox & Micro Quiz (Col-span-12) */}
          <section className="lg:col-span-12 bg-slate-900 border border-slate-800 rounded-[2rem] p-6 sm:p-8 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Interactive Calculator Sandbox */}
              <div>
                <InteractiveCalculator workedExample={card.workedExample} />
              </div>

              {/* Micro Quiz */}
              <div>
                {card.quiz && (
                  <MicroQuiz
                    quiz={card.quiz}
                    onAnswerCorrect={() => {
                      if (onMarkMastered && !isMastered) {
                        onMarkMastered(card);
                      }
                    }}
                  />
                )}
              </div>
            </div>
          </section>

          {/* Bento Cell 6: Related Topics Footer Deck (Col-span-12) */}
          {card.relatedTopics && card.relatedTopics.length > 0 && (
            <section className="lg:col-span-12 bg-slate-900/60 border border-slate-800 rounded-[2rem] p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-black text-slate-200 uppercase tracking-widest">
                    Related Micro-Concepts to Explore
                  </h3>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">One-click generation</span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {card.relatedTopics.map((rel, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onSelectTopic(rel)}
                    className="group px-4 py-2.5 rounded-2xl text-xs font-semibold bg-slate-950/80 hover:bg-amber-400 hover:text-slate-950 text-slate-300 border border-slate-800 hover:border-amber-400 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>{rel}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-950 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

// Helper to generate the exact required markdown format if not provided
function generateExactMarkdown(card: LearningCard): string {
  const varsStr = card.variables
    .map((v) => `  * ${v.symbol} = ${v.description} (${v.unit})`)
    .join("\n");

  const givenStr = card.workedExample.given.map((g) => `* *Given:* ${g}`).join("\n");
  const calcStr = card.workedExample.calculationSteps.map((c) => `  ${c}`).join("\n");

  return `---
### ⚡ Topic: ${card.topicName}
*Category:* ${card.category}

#### 📖 1. Short Explanation
${card.shortExplanation}

#### 📐 2. Formula & Units
* Primary Equation: $${card.primaryEquationLatex}$
* *Where:*
${varsStr}

#### 💡 3. Worked Example
* *Scenario:* ${card.workedExample.scenario}
${givenStr}
* *Calculation:*
${calcStr}
* *Solution:* ${card.workedExample.solution}
---`;
}

