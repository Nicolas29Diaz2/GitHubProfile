import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import {
  UserProfileDto,
  RepositoryDto,
  LanguageStatDto,
} from './dto/user-profile.dto';

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Vue: '#41b883',
  React: '#61dafb',
  Rust: '#dea584',
  Go: '#00ADD8',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  Java: '#b07219',
  PHP: '#4F5D95',
  Shell: '#89e051',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Ruby: '#701516',
};

@Injectable()
export class UserService {
  private readonly githubApiUrl: string;
  private readonly headers: Record<string, string> = {};

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.githubApiUrl = this.configService.get<string>(
      'GITHUB_API_URL',
      'https://api.github.com',
    );
    const token = this.configService.get<string>('GITHUB_TOKEN');
    if (token) {
      this.headers['Authorization'] = `token ${token}`;
    }
  }

  async getUserProfile(username: string): Promise<UserProfileDto> {
    const userUrl = `${this.githubApiUrl}/users/${encodeURIComponent(username)}`;
    const hasToken = Boolean(this.headers['Authorization']);

    // If GITHUB_TOKEN is configured, use /user/repos to fetch both public and private repos
    const reposUrl = hasToken
      ? `${this.githubApiUrl}/user/repos?visibility=all&affiliation=owner&sort=updated&per_page=100`
      : `${this.githubApiUrl}/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=100`;

    try {
      const [userRes, reposRes] = await Promise.all([
        firstValueFrom(
          this.httpService.get(userUrl, { headers: this.headers }),
        ),
        firstValueFrom(
          this.httpService.get(reposUrl, { headers: this.headers }),
        ).catch(() =>
          firstValueFrom(
            this.httpService.get(
              `${this.githubApiUrl}/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=100`,
              { headers: this.headers },
            ),
          ).catch(() => ({ data: [] })),
        ),
      ]);

      const userData = userRes.data;

      const rawRepos: any[] = Array.isArray(reposRes.data) ? reposRes.data : [];

      let totalStars = 0;
      let totalForks = 0;
      const languageCounts: Record<string, number> = {};

      const repositories: RepositoryDto[] = rawRepos.map((repo) => {
        const stargazers = repo.stargazers_count || 0;
        const forks = repo.forks_count || 0;
        totalStars += stargazers;
        totalForks += forks;

        if (repo.language) {
          languageCounts[repo.language] =
            (languageCounts[repo.language] || 0) + 1;
        }

        return {
          id: repo.id,
          name: repo.name,
          full_name: repo.full_name,
          description: repo.description || null,
          html_url: repo.html_url,
          homepage: repo.homepage || null,
          stargazers_count: stargazers,
          forks_count: forks,
          language: repo.language || null,
          topics: Array.isArray(repo.topics) ? repo.topics : [],
          updated_at: repo.updated_at,
          fork: Boolean(repo.fork),
          private: Boolean(repo.private),
        };
      });

      // Sort repos by stars then updated_at
      repositories.sort((a, b) => b.stargazers_count - a.stargazers_count);

      // Compute language statistics
      const totalLangCount = Object.values(languageCounts).reduce(
        (acc, val) => acc + val,
        0,
      );

      const languages: LanguageStatDto[] = Object.entries(languageCounts)
        .map(([name, count]) => ({
          name,
          count,
          percentage: totalLangCount
            ? Math.round((count / totalLangCount) * 100)
            : 0,
          color: LANGUAGE_COLORS[name] || '#8b949e',
        }))
        .sort((a, b) => b.count - a.count);

      return {
        name: userData.name || userData.login,
        login: userData.login,
        avatar_url: userData.avatar_url,
        bio: userData.bio || null,
        company: userData.company || null,
        blog: userData.blog || '',
        location: userData.location || null,
        twitter_username: userData.twitter_username || null,
        public_repos: userData.public_repos || 0,
        followers: userData.followers || 0,
        following: userData.following || 0,
        created_at: userData.created_at,
        html_url: userData.html_url,
        hireable: userData.hireable || null,
        total_stars: totalStars,
        total_forks: totalForks,
        repositories,
        languages,
      };
    } catch (error: any) {
      console.error('GitHub API error:', error?.message);
      if (error.response?.status === 404) {
        throw new NotFoundException(`User "${username}" not found`);
      }
      throw new InternalServerErrorException(
        `Failed to fetch user from GitHub: ${error?.message || 'Unknown error'}`,
      );
    }
  }
}
