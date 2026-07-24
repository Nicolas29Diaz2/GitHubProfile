"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, RefreshCw, Sparkles, Terminal } from "lucide-react";
import { USERNAME, API_URL } from "@/lib/constants";
import { UserProfile, Repository } from "@/types/user";
import { ProfileHeader } from "@/components/ProfileHeader";
import { StatsOverview } from "@/components/StatsOverview";
import { LanguageDistribution } from "@/components/LanguageDistribution";
import { RepositoryGrid } from "@/components/RepositoryGrid";
import { RepoPreviewModal } from "@/components/RepoPreviewModal";
import { SearchBar } from "@/components/SearchBar";

type Status = "loading" | "error" | "success";

export default function Home() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeUsername, setActiveUsername] = useState<string>(USERNAME);
  const [status, setStatus] = useState<Status>("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);

  const fetchProfile = async (user: string) => {
    try {
      setStatus("loading");
      setErrorMessage("");
      const res = await fetch(`${API_URL}/user/${encodeURIComponent(user)}`);

      if (!res.ok) {
        if (res.status === 404) throw new Error(`User "${user}" not found`);
        throw new Error("Could not fetch data from NestJS backend endpoint");
      }

      const data: UserProfile = await res.json();

      setProfile(data);
      setStatus("success");
    } catch (err: any) {
      console.error("Failed to fetch profile:", err);
      setErrorMessage(err.message || "Something went wrong");
      setStatus("error");
    }
  };

  useEffect(() => {
    fetchProfile(activeUsername);
  }, [activeUsername]);

  const handleSearch = (username: string) => {
    setActiveUsername(username);
  };

  return (
    <main className="min-h-screen bg-[#090d16] text-slate-100 relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8">
      {/* Background Animated Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Top Navbar / Search Bar */}
        <SearchBar
          currentUsername={activeUsername}
          onSearch={handleSearch}
          isLoading={status === "loading"}
        />

        {/* Content Views */}
        <AnimatePresence mode="wait">
          {status === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12"
            >
              <LoadingSkeleton />
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-12"
            >
              <ErrorState
                message={errorMessage}
                onRetry={() => fetchProfile(activeUsername)}
              />
            </motion.div>
          )}

          {status === "success" && profile && (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Profile Card Header */}
              <ProfileHeader profile={profile} />

              {/* Key Metrics KPI Cards */}
              <StatsOverview profile={profile} />

              {/* Languages Breakdown */}
              <LanguageDistribution languages={profile.languages} />

              {/* Repositories Showcase */}
              <RepositoryGrid
                repositories={profile.repositories}
                onSelectRepo={(repo) => setSelectedRepo(repo)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="pt-8 border-t border-slate-800/80 text-center text-xs text-slate-300 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span className="font-semibold text-white">
              GitHub Profile Portfolio
            </span>
          </div>
          <p>
            Powered by NestJS backend (
            <code className="text-indigo-300 bg-slate-800/60 px-1.5 py-0.5 rounded">
              GET /user/:username
            </code>
            ) & Next.js Frontend
          </p>
        </footer>
      </div>

      {/* Interactive Modal for Repo Demo / Details */}
      <RepoPreviewModal
        repo={selectedRepo}
        onClose={() => setSelectedRepo(null)}
      />
    </main>
  );
}

function LoadingSkeleton() {
  return (
    <div className="glass-panel rounded-3xl p-8 space-y-8 animate-pulse">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="h-32 w-32 rounded-full bg-slate-800" />
        <div className="flex-1 space-y-3 w-full text-center md:text-left">
          <div className="h-8 w-48 bg-slate-800 rounded-lg mx-auto md:mx-0" />
          <div className="h-4 w-32 bg-slate-800/60 rounded mx-auto md:mx-0" />
          <div className="h-12 w-full max-w-lg bg-slate-800/40 rounded-xl mx-auto md:mx-0" />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-24 bg-slate-800/60 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="glass-panel rounded-3xl p-12 text-center max-w-md mx-auto space-y-4">
      <div className="h-14 w-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
        <AlertCircle className="h-7 w-7" />
      </div>
      <h3 className="text-xl font-bold text-white">Profile Fetch Failed</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{message}</p>
      <div className="pt-2">
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-xl gradient-bg px-4 py-2.5 text-xs font-semibold text-white shadow-lg hover:opacity-90 transition-all"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Try Again</span>
        </button>
      </div>
    </div>
  );
}
