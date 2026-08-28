import React, { useState } from "react";
import { Zap, Sparkles, Flame, Bookmark, Search, RotateCw, BookOpen } from "lucide-react";
import { DailyStreak } from "../types";

interface HeaderProps {
  onGenerateDaily: () => void;
  onSearchTopic: (topic: string) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categories: string[];
  isLoading: boolean;
  streak: DailyStreak;
  savedCount: number;
  onOpenSaved: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onGenerateDaily,
  onSearchTopic,
  selectedCategory,
  onSelectCategory,
  categories,
  isLoading,
  streak,
  savedCount,
  onOpenSaved,
}) => {
  const [inputTopic, setInputTopic] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputTopic.trim()) {
      onSearchTopic(inputTopic.trim());
      setInputTopic("");
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-800/80 bg-[#020617]/90 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        {/* Top row: Brand + Action Buttons */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex flex-col">
              <span className="text-amber-400 text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase mb-0.5">
                Interactive Micro-Learning
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                <span>EEE</span>
                <span className="text-amber-400 italic font-serif">Daily</span>
              </h1>
            </div>

            {/* Mobile streak and bookmarks badge */}
            <div className="flex md:hidden items-center gap-2">
              <div className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-300 border border-orange-500/25 font-semibold">
                <Flame className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
                <span>{streak.currentStreak}d</span>
              </div>
              <button
                type="button"
                onClick={onOpenSaved}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                title="Saved cards"
              >
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search Input and Primary Actions */}
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            {/* Custom Topic Search Form */}
            <form onSubmit={handleSubmit} className="relative flex-1 md:w-64 lg:w-72">
              <input
                type="text"
                placeholder="Search or name a topic (e.g. Buck Converter)..."
                value={inputTopic}
                onChange={(e) => setInputTopic(e.target.value)}
                disabled={isLoading}
                className="w-full pl-9 pr-4 py-2.5 text-xs rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all disabled:opacity-50 font-medium"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </form>

            {/* Primary CTA: Generate Daily Topic */}
            <button
              type="button"
              onClick={onGenerateDaily}
              disabled={isLoading}
              className="group shrink-0 px-4 py-2.5 rounded-2xl text-xs font-black bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-lg shadow-amber-500/10 hover:shadow-amber-500/25 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <RotateCw className="w-4 h-4 animate-spin text-slate-950" />
              ) : (
                <Sparkles className="w-4 h-4 fill-slate-950 text-slate-950 group-hover:rotate-12 transition-transform" />
              )}
              <span>Generate Daily</span>
            </button>

            {/* Desktop Streak Badge & Saved */}
            <div className="hidden md:flex items-center gap-2">
              <div
                className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300"
                title={`You have a ${streak.currentStreak} day learning streak!`}
              >
                <Flame className="w-3.5 h-3.5 fill-orange-400 text-orange-400 animate-pulse" />
                <span>{streak.currentStreak}d Streak</span>
              </div>

              <button
                type="button"
                onClick={onOpenSaved}
                className="relative px-3.5 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                title="View saved and bookmarked modules"
              >
                <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                <span>Saved</span>
                {savedCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
                    {savedCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Category Bento Filter Pills */}
        <div className="flex items-center gap-1.5 mt-3.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest shrink-0 mr-1.5 flex items-center gap-1">
            <BookOpen className="w-3 h-3" /> Categories:
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`px-3 py-1.5 rounded-xl shrink-0 transition-all font-semibold cursor-pointer text-xs ${
                  isSelected
                    ? "bg-amber-400 text-slate-950 shadow-sm"
                    : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
