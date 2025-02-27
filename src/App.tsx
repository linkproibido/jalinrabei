import React, { useState, useEffect, useCallback } from 'react';
import { Search, Loader2, Star, Zap } from 'lucide-react';
import { searchMovies } from './api';
import { Movie } from './types';
import { Link, useNavigate } from 'react-router-dom';
import { usePopUnderAd, useInterstitialAd, BannerAd } from './components/AdManager';

// Rate Limiter with improved performance
const rateLimit = {
  requests: 0,
  lastReset: Date.now(),
  MAX_REQUESTS: 20,
  INTERVAL: 1000,
  
  canRequest: function() {
    const now = Date.now();
    if (now - this.lastReset >= this.INTERVAL) {
      this.requests = 0;
      this.lastReset = now;
    }
    if (this.requests < this.MAX_REQUESTS) {
      this.requests++;
      return true;
    }
    return false;
  }
};

function App() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const navigate = useNavigate();

  // Initialize ads
  usePopUnderAd({
    siteId: 5277720,
    popundersPerIP: "5,1"
  });
  
  useInterstitialAd("8c9e42c8b9fb4376ad91c9351c4dd1e4");

  const fetchMovies = useCallback(async () => {
    if (!debouncedQuery.trim() || !rateLimit.canRequest()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await searchMovies(debouncedQuery);
      setMovies(data.results.filter(movie => movie.poster_path));
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError('Failed to fetch movies. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    fetchMovies();
    if (!debouncedQuery.trim()) setMovies([]);
  }, [debouncedQuery, fetchMovies]);

  const handleMovieClick = useCallback((movie: Movie) => {
    const movieUrl = `/watch/${movie.id}?type=${movie.media_type || 'movie'}`;
    navigate(movieUrl);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
      <div className="relative h-[30vh] md:h-[25vh] bg-gradient-to-b from-purple-900/20 via-blue-900/20 to-[#0a0a0a] flex items-center justify-center px-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1604147495798-57beb5d6af73?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-5"></div>
          <div className="absolute inset-0 bg-grid-pattern"></div>
        </div>
        <div className="relative z-10 w-full max-w-2xl">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-8 h-8 text-purple-500" />
            <h1 className="text-3xl md:text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 animate-gradient">
              LINK PROIBIDO
            </h1>
          </div>
          <div className="relative mt-6">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl blur opacity-20"></div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for movies and TV shows..."
                className="w-full pl-12 pr-4 py-3 bg-gray-900/90 backdrop-blur-sm rounded-xl border border-gray-800 focus:outline-none focus:border-purple-500 transition-all"
                aria-label="Search for movies and TV shows"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {movies.length > 0 && (
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl border border-gray-800 backdrop-blur-sm">
            <BannerAd />
          </div>
        )}

        {error && (
          <div className="text-red-500 text-center mb-6 bg-red-500/10 p-4 rounded-xl border border-red-500/20">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {movies.map((movie) => (
              <div
                key={movie.id}
                onClick={() => handleMovieClick(movie)}
                className="group cursor-pointer bg-gray-900/50 rounded-lg overflow-hidden transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-900/20 border border-gray-800/50 backdrop-blur-sm"
              >
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title || movie.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                    width="500"
                    height="750"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://via.placeholder.com/500x750?text=No+Image';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="flex items-center text-sm mb-1">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span>{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                      </div>
                      <p className="text-xs text-gray-300 line-clamp-3">{movie.overview}</p>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold mb-1 line-clamp-1 group-hover:text-purple-400 transition-colors">
                    {movie.title || movie.name}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {(movie.release_date || movie.first_air_date) 
                      ? new Date(movie.release_date || movie.first_air_date).getFullYear()
                      : 'TBA'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && movies.length === 0 && query.trim() !== '' && (
          <div className="text-center text-gray-400 bg-gray-900/50 p-6 rounded-xl border border-gray-800/50 backdrop-blur-sm">
            No results found for "{query}". Try a different search term.
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 pb-6">
        <Link 
          to="/player-bbb"
          className="block w-full max-w-2xl mx-auto"
          aria-label="Assistir BBB"
        >
          <div className="relative bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800/50 hover:border-purple-500 transition-colors">
            <img 
              src="https://i.ibb.co/MWzrmWc/i553475-1.webp" 
              alt="Assistir BBB" 
              className="w-full h-auto object-cover"
              loading="lazy"
              width="1200"
              height="675"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center pb-4">
              <span className="text-white text-lg md:text-xl font-bold text-center px-4 py-2 bg-purple-600/80 rounded-lg hover:bg-purple-500 transition-colors">
                Assista BBB sem pagar absolutamente nada⚡!
              </span>
            </div>
          </div>
        </Link>
      </div>

      <footer className="text-center py-4 text-gray-400 text-sm border-t border-gray-800/50">
        NÃO HOSPEDAMOS NENHUM CONTEÚDO EM NOSSOS SERVIDORES!
      </footer>
    </div>
  );
}

export default App;