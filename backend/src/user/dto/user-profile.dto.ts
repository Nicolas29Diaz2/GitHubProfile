export interface RepositoryDto {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
  fork: boolean;
  private: boolean;
}

export interface LanguageStatDto {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export class UserProfileDto {
  name: string;
  login: string;
  avatar_url: string;
  bio: string | null;
  company: string | null;
  blog: string;
  location: string | null;
  twitter_username: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  html_url: string;
  hireable?: boolean | null;
  total_stars: number;
  total_forks: number;
  repositories: RepositoryDto[];
  languages: LanguageStatDto[];
}

