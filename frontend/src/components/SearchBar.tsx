"use client";

import { useState } from "react";
import { Search, Sparkles, Copy, Check, Terminal } from "lucide-react";
import { API_URL } from "@/lib/constants";

interface SearchBarProps {
  currentUsername: string;
  onSearch: (username: string) => void;
  isLoading: boolean;
}

export function SearchBar({
  currentUsername,
  onSearch,
  isLoading,
}: SearchBarProps) {
  const [inputVal, setInputVal] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputVal.trim();
    if (trimmed) {
      onSearch(trimmed);
      setInputVal("");
    }
  };

  const copyEndpoint = () => {
    const endpoint = `${API_URL}/user/${currentUsername}`;
    navigator.clipboard.writeText(endpoint);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSubmit} className="relative w-full sm:max-w-md">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Search GitHub user (e.g. Nicolas29Diaz2)..."
              disabled={isLoading}
              className="w-full rounded-xl bg-slate-900/80 border border-slate-700/60 pl-10 pr-24 py-2.5 text-sm text-white placeholder-slate-400 shadow-inner focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !inputVal.trim()}
              className="absolute right-1.5 flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md transition-all hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Fetch</span>
                </>
              )}
            </button>
          </div>
        </form>

        <button
          onClick={copyEndpoint}
          title="Click to copy backend API endpoint URL"
          className="flex items-center gap-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 px-3.5 py-2 text-xs font-mono text-indigo-300 transition-all"
        >
          <Terminal className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
          <span className="hidden md:inline text-slate-400">Endpoint:</span>
          <span className="truncate max-w-[200px] text-slate-200">
            GET /user/{currentUsername}
          </span>
          {copied ? (
            <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          ) : (
            <Copy className="h-3.5 w-3.5 text-slate-400 hover:text-white shrink-0" />
          )}
        </button>
      </div>
    </div>
  );
}
