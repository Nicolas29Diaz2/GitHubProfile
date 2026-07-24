"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Star,
  GitFork,
  ExternalLink,
  Search,
  Filter,
  Eye,
  FolderGit2,
  Lock,
  Globe,
} from "lucide-react";
import { Repository } from "@/types/user";

interface RepositoryGridProps {
  repositories: Repository[];
  onSelectRepo: (repo: Repository) => void;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function RepositoryGrid({
  repositories,
  onSelectRepo,
}: RepositoryGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("ALL");
  const [visibilityFilter, setVisibilityFilter] = useState<
    "ALL" | "PUBLIC" | "PRIVATE"
  >("ALL");

  if (!repositories || repositories.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center text-slate-400">
        <FolderGit2 className="h-8 w-8 mx-auto text-slate-600 mb-2" />
        <p className="text-sm font-medium">No repositories found</p>
      </div>
    );
  }

  const hasPrivateRepos = repositories.some((r) => r.private);

  // Extract unique languages
  const languages = Array.from(
    new Set(repositories.map((r) => r.language).filter(Boolean)),
  ) as string[];

  // Filter repositories
  const filteredRepos = repositories.filter((repo) => {
    const matchesSearch =
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (repo.description &&
        repo.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      repo.topics.some((t) =>
        t.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesLang =
      selectedLanguage === "ALL" || repo.language === selectedLanguage;

    const matchesVisibility =
      visibilityFilter === "ALL" ||
      (visibilityFilter === "PUBLIC" && !repo.private) ||
      (visibilityFilter === "PRIVATE" && repo.private);

    return matchesSearch && matchesLang && matchesVisibility;
  });

  return (
    <div className="space-y-5">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400">
            <FolderGit2 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-wide">
              Featured Projects & Repositories
            </h3>
            <p className="text-xs text-slate-400">
              Showing {filteredRepos.length} of {repositories.length} repos
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Visibility Filter Tabs */}
          {hasPrivateRepos && (
            <div className="flex items-center rounded-xl bg-slate-900/80 border border-slate-800 p-1">
              <button
                onClick={() => setVisibilityFilter("ALL")}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  visibilityFilter === "ALL"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setVisibilityFilter("PUBLIC")}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  visibilityFilter === "PUBLIC"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Public
              </button>
              <button
                onClick={() => setVisibilityFilter("PRIVATE")}
                className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  visibilityFilter === "PRIVATE"
                    ? "bg-amber-600 text-white shadow-sm"
                    : "text-amber-400/80 hover:text-amber-300"
                }`}
              >
                <Lock className="h-3 w-3" />
                <span>Private</span>
              </button>
            </div>
          )}

          {/* Search Box */}
          <div className="relative flex-1 sm:w-44">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter repos..."
              className="w-full rounded-xl bg-slate-900/80 border border-slate-800 pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Language Selector */}
          {languages.length > 0 && (
            <div className="relative">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="appearance-none rounded-xl bg-slate-900/80 border border-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 focus:border-indigo-500 focus:outline-none pr-8 cursor-pointer"
              >
                <option value="ALL">All Languages</option>
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
              <Filter className="absolute right-2.5 top-2.5 h-3 w-3 text-slate-400 pointer-events-none" />
            </div>
          )}
        </div>
      </div>

      {/* Grid of Repo Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRepos.map((repo, idx) => (
          <motion.div
            key={repo.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.04 }}
            className={`glass-card glass-card-hover rounded-2xl p-5 flex flex-col justify-between group relative overflow-hidden ${
              repo.private ? "border-amber-500/20 bg-amber-950/10" : ""
            }`}
          >
            {/* Top row: Name & Badges */}
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4
                  onClick={() => onSelectRepo(repo)}
                  className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors cursor-pointer truncate max-w-[200px]"
                >
                  {repo.name}
                </h4>

                <div className="flex items-center gap-1.5 shrink-0">
                  {repo.private ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400">
                      <Lock className="h-2.5 w-2.5" /> Private
                    </span>
                  ) : repo.homepage ? (
                    <a
                      href={repo.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:underline"
                    >
                      <Globe className="h-2.5 w-2.5" /> Demo
                    </a>
                  ) : null}

                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-300 bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700/60">
                    <Star className="h-3 w-3 text-amber-400" />
                    <span>{repo.stargazers_count}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 line-clamp-2 min-h-[36px] leading-relaxed mb-4">
                {repo.description || "No description provided."}
              </p>
            </div>

            {/* Bottom metadata */}
            <div className="space-y-3 pt-3 border-t border-slate-800/60">
              {/* Language & Forks */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  {repo.language && (
                    <span className="font-semibold text-slate-300">
                      {repo.language}
                    </span>
                  )}
                  <span className="text-[10px] text-slate-500">•</span>
                  <span>{formatDate(repo.updated_at)}</span>
                </div>

                <div className="flex items-center gap-1 text-slate-400">
                  <GitFork className="h-3 w-3" />
                  <span>{repo.forks_count}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => onSelectRepo(repo)}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700/60 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-all"
                >
                  <Eye className="h-3.5 w-3.5 text-indigo-400" />
                  <span>View Details</span>
                </button>

                {!repo.private && (
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/60 text-slate-400 hover:text-white transition-all"
                    title="Open GitHub Repository"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
