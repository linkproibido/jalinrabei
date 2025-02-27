import axios from 'axios';
import { SearchResponse, TVShowDetails, Episode } from './types';

// Create a reusable axios instance with common config
const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: '31adb0e5095444a8ccacafdf73778714',
    language: 'pt-BR',
  },
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add response caching
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const getCachedData = async (key: string, fetchFn: () => Promise<any>) => {
  const now = Date.now();
  const cachedItem = cache.get(key);
  
  if (cachedItem && now - cachedItem.timestamp < CACHE_TTL) {
    return cachedItem.data;
  }
  
  try {
    const data = await fetchFn();
    cache.set(key, { data, timestamp: now });
    return data;
  } catch (error) {
    // If error occurs and we have cached data, return it even if expired
    if (cachedItem) {
      return cachedItem.data;
    }
    throw error;
  }
};

export const searchMovies = async (query: string): Promise<SearchResponse> => {
  const cacheKey = `search_${query}`;
  return getCachedData(cacheKey, async () => {
    const response = await api.get('/search/multi', {
      params: {
        query,
        include_adult: false,
      },
    });
    return response.data;
  });
};

export const getTVShowDetails = async (id: number): Promise<TVShowDetails> => {
  const cacheKey = `tv_${id}`;
  return getCachedData(cacheKey, async () => {
    const response = await api.get(`/tv/${id}`);
    return response.data;
  });
};

export const getSeasonEpisodes = async (
  tvId: number,
  seasonNumber: number
): Promise<{ episodes: Episode[] }> => {
  const cacheKey = `season_${tvId}_${seasonNumber}`;
  return getCachedData(cacheKey, async () => {
    const response = await api.get(`/tv/${tvId}/season/${seasonNumber}`);
    return response.data;
  });
};