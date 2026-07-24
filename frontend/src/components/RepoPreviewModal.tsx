"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ExternalLink,
  Star,
  GitFork,
  Globe,
  Tag,
  Calendar,
  Layers,
  Lock,
  Sparkles,
} from "lucide-react";
import { Repository } from "@/types/user";

interface RepoPreviewModalProps {
  repo: Repository | null;
  onClose: () => void;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function RepoPreviewModal({ repo, onClose }: RepoPreviewModalProps) {
  if (!repo) return null;

  const hasHomepage = Boolean(
    repo.homepage && repo.homepage.startsWith("http")
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="glass-panel relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl border border-slate-700/60 z-10"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-900/90">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white truncate max-w-md">
                    {repo.name}
                  </h3>
                  {repo.private ? (
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      <Lock className="h-3 w-3" /> Private
                    </span>
                  ) : repo.fork ? (
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                      Fork
                    </span>
                  ) : null}
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  {repo.full_name}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Meta badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl bg-slate-900/70 border border-slate-800 p-3 flex items-center gap-3">
                <Star className="h-4 w-4 text-amber-400 shrink-0" />
                <div>
                  <div className="text-xs text-slate-400">Stars</div>
                  <div className="text-sm font-bold text-white">
                    {repo.stargazers_count}
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-slate-900/70 border border-slate-800 p-3 flex items-center gap-3">
                <GitFork className="h-4 w-4 text-purple-400 shrink-0" />
                <div>
                  <div className="text-xs text-slate-400">Forks</div>
                  <div className="text-sm font-bold text-white">
                    {repo.forks_count}
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-slate-900/70 border border-slate-800 p-3 flex items-center gap-3">
                <Calendar className="h-4 w-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs text-slate-400">Updated</div>
                  <div className="text-sm font-bold text-white">
                    {formatDate(repo.updated_at)}
                  </div>
                </div>
              </div>

              {repo.language && (
                <div className="rounded-xl bg-slate-900/70 border border-slate-800 p-3 flex items-center gap-3">
                  <Globe className="h-4 w-4 text-blue-400 shrink-0" />
                  <div>
                    <div className="text-xs text-slate-400">Language</div>
                    <div className="text-sm font-bold text-white">
                      {repo.language}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            {repo.description && (
              <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 p-4">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  About Project
                </h4>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {repo.description}
                </p>
              </div>
            )}

            {/* Topics */}
            {repo.topics && repo.topics.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-indigo-400" /> Topics & Tech Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {repo.topics.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 text-xs font-medium text-indigo-300"
                    >
                      #{topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons & Links */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              {hasHomepage && (
                <a
                  href={repo.homepage!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:flex-1 flex items-center justify-center gap-2 rounded-xl gradient-bg px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 hover:opacity-90 transition-all"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Visit Website / Live Demo</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}

              {!repo.private && (
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full ${
                    hasHomepage ? "sm:w-auto" : "sm:flex-1"
                  } flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2.5 text-xs font-semibold text-white transition-all`}
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>View Repository on GitHub</span>
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
