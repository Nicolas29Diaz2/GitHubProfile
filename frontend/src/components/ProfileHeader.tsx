"use client";

import { motion } from "framer-motion";
import {
  ExternalLink,
  MapPin,
  Building2,
  Globe,
  AtSign,
  Calendar,
  Share2,
  Check,
  Briefcase,
} from "lucide-react";
import { UserProfile } from "@/types/user";
import { useState } from "react";

interface ProfileHeaderProps {
  profile: UserProfile;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const [copiedShare, setCopiedShare] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${profile.name} (@${profile.login}) - GitHub Profile`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const infoPills = [
    { icon: Building2, label: "Company", value: profile.company },
    { icon: MapPin, label: "Location", value: profile.location },
    {
      icon: Globe,
      label: "Website",
      value: profile.blog || null,
      isLink: true,
    },
    {
      icon: AtSign,
      label: "Twitter",
      value: profile.twitter_username
        ? `@${profile.twitter_username}`
        : null,
      isTwitter: true,
    },
    {
      icon: Calendar,
      label: "Joined",
      value: formatDate(profile.created_at),
    },
  ].filter((item) => item.value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel relative overflow-hidden rounded-3xl p-6 md:p-8"
    >
      {/* Dynamic Header Glow Effect */}
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-pink-500/15 blur-3xl pointer-events-none" />

      <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
        {/* Avatar with Glow and Status Badge */}
        <div className="relative shrink-0">
          <div className="glow-avatar rounded-full p-1 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500">
            <img
              src={profile.avatar_url}
              alt={`${profile.login}'s avatar`}
              className="h-28 w-28 md:h-32 md:w-32 rounded-full object-cover border-2 border-slate-900"
            />
          </div>
          <div className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-emerald-500 border-4 border-slate-900" title="Active on GitHub" />
        </div>

        {/* User Metadata */}
        <div className="flex-1 text-center md:text-left space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                  {profile.name}
                </h1>
                {profile.hireable && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                    <Briefcase className="h-3 w-3" /> Available for hire
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-indigo-400 mt-0.5">
                @{profile.login}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-center md:justify-end gap-2.5 pt-2 sm:pt-0">
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 px-3.5 py-2 text-xs font-medium text-slate-200 transition-all active:scale-95"
              >
                {copiedShare ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-3.5 w-3.5 text-slate-400" />
                    <span>Share</span>
                  </>
                )}
              </button>

              <a
                href={profile.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-xl gradient-bg px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-500/20 hover:opacity-90 transition-all active:scale-95"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>GitHub Profile</span>
              </a>
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className="text-sm md:text-base text-slate-300 max-w-2xl leading-relaxed">
              {profile.bio}
            </p>
          )}

          {/* Info Pills */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-2">
            {infoPills.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 px-3 py-1.5 text-xs text-slate-300"
              >
                <item.icon className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                {item.isLink ? (
                  <a
                    href={
                      item.value!.startsWith("http")
                        ? item.value!
                        : `https://${item.value}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-300 hover:underline"
                  >
                    {item.value}
                  </a>
                ) : item.isTwitter ? (
                  <a
                    href={`https://twitter.com/${profile.twitter_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-300 hover:underline"
                  >
                    {item.value}
                  </a>
                ) : (
                  <span>{item.value}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
