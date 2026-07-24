"use client";

import { motion } from "framer-motion";
import { Code2 } from "lucide-react";
import { LanguageStat } from "@/types/user";

interface LanguageDistributionProps {
  languages: LanguageStat[];
}

export function LanguageDistribution({ languages }: LanguageDistributionProps) {
  if (!languages || languages.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-panel rounded-2xl p-5 md:p-6 space-y-4"
    >
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          <Code2 className="h-4 w-4" />
        </div>
        <h3 className="text-base font-bold text-white tracking-wide">
          Languages & Tech Stack
        </h3>
      </div>

      {/* Multi-segmented Progress Bar */}
      <div className="h-3 w-full rounded-full bg-slate-900 overflow-hidden flex p-0.5 border border-slate-800">
        {languages.map((lang) => (
          <div
            key={lang.name}
            style={{
              width: `${Math.max(lang.percentage, 2)}%`,
              backgroundColor: lang.color,
            }}
            className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-500 hover:opacity-90"
            title={`${lang.name}: ${lang.percentage}% (${lang.count} repos)`}
          />
        ))}
      </div>

      {/* Language Pills Legend */}
      <div className="flex flex-wrap items-center gap-3 pt-1">
        {languages.map((lang) => (
          <div
            key={lang.name}
            className="flex items-center gap-2 rounded-xl bg-slate-800/60 border border-slate-700/50 px-3 py-1.5 text-xs"
          >
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: lang.color }}
            />
            <span className="font-medium text-slate-200">{lang.name}</span>
            <span className="text-slate-400 font-mono text-[11px]">
              {lang.percentage}%
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
