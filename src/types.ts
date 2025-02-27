export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
  media_type?: 'movie' | 'tv';
  name?: string;
  first_air_date?: string;
}

export interface SearchResponse {
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface Season {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
}

export interface Episode {
  air_date: string;
  episode_number: number;
  id: number;
  name: string;
  overview: string;
  still_path: string;
  vote_average: number;
}

export interface TVShowDetails {
  seasons: Season[];
  name: string;
  number_of_seasons: number;
}