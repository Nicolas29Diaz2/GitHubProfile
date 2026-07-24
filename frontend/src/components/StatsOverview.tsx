"use client";

import { motion } from "framer-motion";
import { BookOpen, Star, GitFork, Users, UserCheck } from "lucide-react";
import { UserProfile } from "@/types/user";

interface StatsOverviewProps {
  profile: UserProfile;
}

export function StatsOverview({ profile }: StatsOverviewProps) {
  const stats = [
    {
      label: "Public Repos",
      value: profile.public_repos,
      icon: BookOpen,
      color: "from-blue-500 to-indigo-600",
      iconColor: "text-blue-400",
    },
    {
      label: "Total Stars",
      value: profile.total_stars,
      icon: Star,
      color: "from-amber-400 to-orange-500",
      iconColor: "text-amber-400",
    },
    {
      label: "Total Forks",
      value: profile.total_forks,
      icon: GitFork,
      color: "from-purple-500 to-pink-500",
      iconColor: "text-purple-400",
    },
    {
      label: "Followers",
      value: profile.followers,
      icon: Users,
      color: "from-emerald-400 to-teal-500",
      iconColor: "text-emerald-400",
    },
    {
      label: "Following",
      value: profile.following,
      icon: UserCheck,
      color: "from-cyan-400 to-blue-500",
      iconColor: "text-cyan-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
      {stats.map((stat, idx) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 + idx * 0.05 }}
          className="glass-card glass-card-hover rounded-2xl p-4 flex flex-col items-start justify-between relative overflow-hidden"
        >
          <div className="flex items-center justify-between w-full mb-3">
            <span className="text-xs font-medium text-slate-400">
              {stat.label}
            </span>
            <div className={`p-2 rounded-xl bg-slate-800/80 border border-slate-700/50 ${stat.iconColor}`}>
              <stat.icon className="h-4 w-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {stat.value.toLocaleString()}
            </span>
          </div>

          {/* Subtle Accent Glow Bar */}
          <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} opacity-80`} />
        </motion.div>
      ))}
    </div>
  );
}
