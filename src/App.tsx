import React, { useState, useEffect, useMemo } from "react";
import { LearningCard, DailyStreak } from "./types";
import { PRESET_CARDS, CATEGORIES, POPULAR_PROMPTS } from "./data/presetTopics";
import { Header } from "./components/Header";
import { LearningCardView } from "./components/LearningCardView";
import { SavedCardsModal } from "./components/SavedCardsModal";
import {
  Zap,
  Sparkles,
  Search,
  BookOpen,
  RotateCw,
  Cpu,
  Radio,
  Flame,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import confetti from "canvas-confetti";

const STORAGE_KEY_SAVED = "eee_saved_cards_v1";
const STORAGE_KEY_HISTORY = "eee_history_cards_v1";
const STORAGE_KEY_STREAK = "eee_daily_streak_v1";

export default function App() {
  const [currentCard, setCurrentCard] = useState<LearningCard>(PRESET_CARDS[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All Topics");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState<boolean>(false);

  // LocalStorage state: Saved Cards
  const [savedCards, setSavedCards] = useState<LearningCard[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SAVED);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // LocalStorage state: History Cards
  const [historyCards, setHistoryCards] = useState<LearningCard[]>(() => {
    try {
      const hist = localStorage.getItem(STORAGE_KEY_HISTORY);
      return hist ? JSON.parse(hist) : PRESET_CARDS.slice(0, 3);
    } catch {
      return PRESET_CARDS.slice(0, 3);
    }
  });

  // LocalStorage state: Daily Streak
  const [streak, setStreak] = useState<DailyStreak>(() => {
    try {
      const savedStreak = localStorage.getItem(STORAGE_KEY_STREAK);
      const today = new Date().toISOString().split("T")[0];
      if (savedStreak) {
        const parsed: DailyStreak = JSON.parse(savedStreak);
        return parsed;
      }
      return {
        currentStreak: 1,
        lastActiveDate: today,
        historyDates: [today],
        totalCardsLearned: 1,
      };
    } catch {
      const today = new Date().toISOString().split("T")[0];
      return {
        currentStreak: 1,
        lastActiveDate: today,
        historyDates: [today],
        totalCardsLearned: 1,
      };
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(savedCards));
    } catch (e) {
      console.warn("Storage error:", e);
    }
  }, [savedCards]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(historyCards));
    } catch (e) {
      console.warn("Storage error:", e);
    }
  }, [historyCards]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STREAK, JSON.stringify(streak));
    } catch (e) {
      console.warn("Storage error:", e);
    }
  }, [streak]);

  // Update streak when learning
  const recordLearningActivity = () => {
    const today = new Date().toISOString().split("T")[0];
    setStreak((prev) => {
      if (prev.lastActiveDate === today) {
        return {
          ...prev,
          totalCardsLearned: prev.totalCardsLearned + 1,
        };
      }

      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      const isConsecutive = prev.lastActiveDate === yesterday;
      const newStreak = isConsecutive ? prev.currentStreak + 1 : 1;

      return {
        currentStreak: newStreak,
        lastActiveDate: today,
        historyDates: Array.from(new Set([...prev.historyDates, today])),
        totalCardsLearned: prev.totalCardsLearned + 1,
      };
    });
  };

  // Generate or fetch an EEE learning card from the server
  const handleFetchTopic = async (topicQuery: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Check if this topic matches one of our rich preset cards locally first (for instantaneous response)
      const localMatch = PRESET_CARDS.find(
        (p) => p.topicName.toLowerCase() === topicQuery.toLowerCase()
      );

      if (localMatch && topicQuery.toLowerCase() !== "generate daily topic") {
        setCurrentCard(localMatch);
        recordLearningActivity();
        addToHistory(localMatch);
        setIsLoading(false);
        return;
      }

      const res = await fetch("/api/generate-topic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topicQuery }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with status ${res.status}`);
      }

      const data: LearningCard = await res.json();
      data.id = `${data.topicName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;
      data.timestamp = Date.now();

      setCurrentCard(data);
      recordLearningActivity();
      addToHistory(data);

      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.6 },
      });
    } catch (err: any) {
      console.error("Failed to generate topic:", err);
      // Fallback: pick a preset card if network or API key fails
      const fallback = PRESET_CARDS[Math.floor(Math.random() * PRESET_CARDS.length)];
      setCurrentCard(fallback);
      setErrorMessage(
        `Note: Using offline fallback module (${fallback.topicName}). API Notice: ${err.message}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const addToHistory = (card: LearningCard) => {
    setHistoryCards((prev) => {
      const filtered = prev.filter((c) => c.topicName.toLowerCase() !== card.topicName.toLowerCase());
      return [card, ...filtered].slice(0, 25);
    });
  };

  const handleToggleBookmark = (card: LearningCard) => {
    setSavedCards((prev) => {
      const exists = prev.some((c) => c.topicName.toLowerCase() === card.topicName.toLowerCase());
      if (exists) {
        return prev.filter((c) => c.topicName.toLowerCase() !== card.topicName.toLowerCase());
      } else {
        return [{ ...card, isBookmarked: true }, ...prev];
      }
    });
  };

  const handleMarkMastered = (card: LearningCard) => {
    const updated = { ...card, isMastered: !card.isMastered };
    setCurrentCard(updated);
    setSavedCards((prev) =>
      prev.map((c) => (c.topicName.toLowerCase() === card.topicName.toLowerCase() ? updated : c))
    );
    setHistoryCards((prev) =>
      prev.map((c) => (c.topicName.toLowerCase() === card.topicName.toLowerCase() ? updated : c))
    );
  };

  const isCurrentBookmarked = useMemo(() => {
    return savedCards.some((c) => c.topicName.toLowerCase() === currentCard.topicName.toLowerCase());
  }, [savedCards, currentCard]);

  // Filter presets based on category
  const filteredPresets = useMemo(() => {
    if (selectedCategory === "All Topics") return PRESET_CARDS;
    return PRESET_CARDS.filter((c) => c.category.toLowerCase() === selectedCategory.toLowerCase());
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col selection:bg-amber-400/30 selection:text-amber-200">
      {/* Top Navigation */}
      <Header
        onGenerateDaily={() => handleFetchTopic("Generate Daily Topic")}
        onSearchTopic={(t) => handleFetchTopic(t)}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categories={CATEGORIES}
        isLoading={isLoading}
        streak={streak}
        savedCount={savedCards.length}
        onOpenSaved={() => setIsSavedModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error / Offline Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-amber-400 font-bold hover:underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Loading Skeleton / Generator State */}
        {isLoading ? (
          <div className="w-full max-w-3xl mx-auto py-16 px-6 rounded-[2rem] border border-slate-800 bg-slate-900/60 backdrop-blur-md text-center space-y-6 animate-pulse shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-400/10">
              <RotateCw className="w-8 h-8 animate-spin text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Generating EEE Micro-Learning Module...</h2>
              <p className="text-xs text-slate-400 mt-1.5 max-w-md mx-auto">
                Synthesizing engineering formulas, LaTeX mathematical models, units, and practical worked calculations.
              </p>
            </div>
            <div className="flex justify-center items-center gap-2 text-xs font-mono text-cyan-400">
              <Cpu className="w-4 h-4 animate-bounce" />
              <span>Formatting LaTeX equations & Worked Example calculations</span>
            </div>
          </div>
        ) : (
          /* Primary Learning Card Content */
          <div className="space-y-8">
            <LearningCardView
              card={currentCard}
              onSelectTopic={(topic) => handleFetchTopic(topic)}
              onToggleBookmark={handleToggleBookmark}
              isBookmarked={isCurrentBookmarked}
              onMarkMastered={handleMarkMastered}
              isMastered={currentCard.isMastered}
            />

            {/* Quick Explore Deck: Popular & Category Specific Topics */}
            <section className="pt-8 border-t border-slate-800/80">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">
                    Explore Electrical Engineering Topics
                  </h3>
                </div>
                <span className="text-xs text-slate-500 font-medium">Bento Quick Launch</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {POPULAR_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleFetchTopic(prompt)}
                    className="p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-amber-400/50 text-left text-xs transition-all group cursor-pointer flex flex-col justify-between min-h-[92px] shadow-sm hover:shadow-md hover:shadow-amber-400/5"
                  >
                    <span className="font-bold text-slate-200 group-hover:text-amber-300 line-clamp-2 leading-snug">
                      {prompt === "Generate Daily Topic" ? "⚡ Daily Topic" : prompt}
                    </span>
                    <span className="text-[10px] text-slate-500 group-hover:text-amber-400 mt-2 font-mono flex items-center gap-1">
                      Explore card →
                    </span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 py-6 bg-slate-950/60 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-400">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="font-black text-white">Daily EEE Learning</span>
            <span className="text-slate-500 hidden sm:inline">— Micro-learning for Electrical & Electronics Engineers</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Structured micro-cards with LaTeX math, unit verification, and interactive problem sandboxes.
          </p>
        </div>
      </footer>

      {/* Saved Cards and History Modal */}
      <SavedCardsModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedCards={savedCards}
        historyCards={historyCards}
        onSelectCard={(card) => {
          setCurrentCard(card);
          setIsSavedModalOpen(false);
        }}
        onRemoveBookmark={handleToggleBookmark}
        onClearHistory={() => setHistoryCards([])}
      />
    </div>
  );
}
