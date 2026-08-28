import React, { useState } from "react";
import { QuizQuestion } from "../types";
import { HelpCircle, CheckCircle, XCircle, Award } from "lucide-react";
import confetti from "canvas-confetti";

interface MicroQuizProps {
  quiz: QuizQuestion;
  onAnswerCorrect?: () => void;
}

export const MicroQuiz: React.FC<MicroQuizProps> = ({ quiz, onAnswerCorrect }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  const handleSelect = (index: number) => {
    if (hasSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null || hasSubmitted) return;
    setHasSubmitted(true);
    if (selectedOption === quiz.correctIndex) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
      });
      if (onAnswerCorrect) onAnswerCorrect();
    }
  };

  const isCorrect = selectedOption === quiz.correctIndex;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 sm:p-6 text-slate-200 shadow-lg">
      <div className="flex items-center gap-2.5 mb-3.5 pb-3 border-b border-slate-800">
        <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
          <HelpCircle className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-violet-200">
            Concept Check Micro-Quiz
          </h4>
          <p className="text-[11px] text-slate-400">Lock in your knowledge with this quick test</p>
        </div>
      </div>

      <p className="text-sm font-semibold text-slate-100 mb-3.5 leading-snug">{quiz.question}</p>

      <div className="space-y-2 mb-3.5">
        {quiz.options.map((opt, idx) => {
          let btnStyle = "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/80";
          if (selectedOption === idx) {
            btnStyle = "bg-violet-950/60 border-violet-500 text-violet-100 font-semibold";
          }
          if (hasSubmitted) {
            if (idx === quiz.correctIndex) {
              btnStyle = "bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold";
            } else if (selectedOption === idx && !isCorrect) {
              btnStyle = "bg-rose-950/60 border-rose-500 text-rose-200";
            } else {
              btnStyle = "bg-slate-950/40 border-slate-900 text-slate-600 opacity-60";
            }
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={hasSubmitted}
              onClick={() => handleSelect(idx)}
              className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
            >
              <span>{opt}</span>
              {hasSubmitted && idx === quiz.correctIndex && (
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
              )}
              {hasSubmitted && selectedOption === idx && !isCorrect && (
                <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-2" />
              )}
            </button>
          );
        })}
      </div>

      {!hasSubmitted ? (
        <button
          type="button"
          disabled={selectedOption === null}
          onClick={handleSubmit}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-black transition-all ${
            selectedOption !== null
              ? "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/20 cursor-pointer"
              : "bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed"
          }`}
        >
          Check Answer
        </button>
      ) : (
        <div
          className={`p-3.5 rounded-xl text-xs border ${
            isCorrect
              ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200"
              : "bg-slate-950/80 border-slate-800 text-slate-300"
          }`}
        >
          <div className="flex items-center gap-1.5 font-bold mb-1.5">
            {isCorrect ? (
              <>
                <Award className="w-4 h-4 text-emerald-400" />
                <span>Correct! Knowledge locked.</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-rose-400" />
                <span>Explanation:</span>
              </>
            )}
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px]">{quiz.explanation}</p>
        </div>
      )}
    </div>
  );
};
