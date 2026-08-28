import React from "react";
import { LearningCard } from "../types";
import { X, Bookmark, Trash2, ArrowRight, CheckCircle2, BookOpen } from "lucide-react";

interface SavedCardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedCards: LearningCard[];
  historyCards: LearningCard[];
  onSelectCard: (card: LearningCard) => void;
  onRemoveBookmark: (card: LearningCard) => void;
  onClearHistory: () => void;
}

export const SavedCardsModal: React.FC<SavedCardsModalProps> = ({
  isOpen,
  onClose,
  savedCards,
  historyCards,
  onSelectCard,
  onRemoveBookmark,
  onClearHistory,
}) => {
  const [tab, setTab] = React.useState<"saved" | "history">("saved");

  if (!isOpen) return null;

  const currentList = tab === "saved" ? savedCards : historyCards;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white tracking-tight">EEE Micro-Learning Library</h3>
              <p className="text-xs text-slate-400">Review bookmarked cards and recently generated topics</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 pt-3 gap-3">
          <button
            type="button"
            onClick={() => setTab("saved")}
            className={`pb-3 text-xs font-black tracking-wide border-b-2 transition-colors px-2 cursor-pointer flex items-center gap-2 ${
              tab === "saved"
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Bookmarked ({savedCards.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setTab("history")}
            className={`pb-3 text-xs font-black tracking-wide border-b-2 transition-colors px-2 cursor-pointer flex items-center gap-2 ${
              tab === "history"
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Recent History ({historyCards.length})</span>
          </button>
        </div>

        {/* List Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {currentList.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-xs">
              <p className="text-sm font-semibold text-slate-300">No {tab === "saved" ? "saved cards" : "recent cards"} yet.</p>
              <p className="mt-1.5 text-slate-500">
                Explore any EEE topic and tap the save button to keep it in your library.
              </p>
            </div>
          ) : (
            currentList.map((c, idx) => (
              <div
                key={c.id || idx}
                className="group p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-amber-400/50 hover:bg-slate-950 transition-all flex items-center justify-between gap-4"
              >
                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => {
                    onSelectCard(c);
                    onClose();
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-900 text-amber-400 font-mono font-bold border border-slate-800">
                      {c.category}
                    </span>
                    {c.isMastered && (
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Mastered
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-black text-white group-hover:text-amber-300 truncate">
                    ⚡ {c.topicName}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {c.shortExplanation}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {tab === "saved" && (
                    <button
                      type="button"
                      onClick={() => onRemoveBookmark(c)}
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-800 cursor-pointer"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      onSelectCard(c);
                      onClose();
                    }}
                    className="p-2 rounded-xl text-slate-400 group-hover:text-amber-400 hover:bg-slate-800 cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {tab === "history" && historyCards.length > 0 && (
          <div className="p-4 border-t border-slate-800 flex justify-end bg-slate-950/40 px-6">
            <button
              type="button"
              onClick={onClearHistory}
              className="text-xs text-rose-400 hover:underline flex items-center gap-1.5 cursor-pointer font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear History
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
