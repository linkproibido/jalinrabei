import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getTVShowDetails, getSeasonEpisodes } from './api';
import { TVShowDetails, Episode } from './types';
import { usePopUnderAd, useInterstitialAd, BannerAd } from './components/AdManager';

export default function Player() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tvDetails, setTVDetails] = useState<TVShowDetails | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [provider, setProvider] = useState<'embedder' | 'ultraembed' | 'vidIngles' | 'vidPremium'>('embedder');
  
  // Initialize ads
  usePopUnderAd({
    siteId: 5277720,
    popundersPerIP: "20,10"
  });
  
  useInterstitialAd("8c9e42c8b9fb4376ad91c9351c4dd1e4");

  const mediaType = searchParams.get('type') || 'movie';

  // Load TV show details
  useEffect(() => {
    if (mediaType === 'tv' && id) {
      getTVShowDetails(parseInt(id)).then(setTVDetails);
    }
  }, [id, mediaType]);

  // Load season episodes
  useEffect(() => {
    if (mediaType === 'tv' && id) {
      getSeasonEpisodes(parseInt(id), selectedSeason).then((data) =>
        setEpisodes(data.episodes)
      );
    }
  }, [id, selectedSeason, mediaType]);

  // Sync URL params with state
  useEffect(() => {
    const season = searchParams.get('season');
    const episode = searchParams.get('episode');
    if (season) setSelectedSeason(parseInt(season));
    if (episode) setSelectedEpisode(parseInt(episode));
  }, [searchParams]);

  // Generate iframe URL based on provider
  const getEmbedUrl = () => {
    switch (provider) {
      case 'embedder':
        return mediaType === 'movie'
          ? `https://embedder.net/e/movie?tmdb=${id}`
          : `https://embedder.net/e/series?tmdb=${id}&sea=${selectedSeason}&epi=${selectedEpisode}`;
      case 'ultraembed':
        return mediaType === 'movie'
          ? `https://ultraembed.com/filme/${id}`
          : `https://ultraembed.com/serie/${id}/${selectedSeason}/${selectedEpisode}`;
      case 'vidIngles':
        return mediaType === 'movie'
          ? `https://vidsrc.xyz/embed/movie/${id}`
          : `https://vidsrc.xyz/embed/tv?imdb=${id}&season=${selectedSeason}&episode=${selectedEpisode}`;
      case 'vidPremium':
        return mediaType === 'movie'
          ? `https://vidsrc.dev/embed/movie/${id}`
          : `https://vidsrc.dev/embed/tv/${id}/${selectedSeason}/${selectedEpisode}`;
      default:
        return '';
    }
  };

  const filteredEpisodes = episodes.filter((episode) =>
    episode.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Banner Ad */}
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl border border-gray-800 backdrop-blur-sm">
          <BannerAd />
        </div>

        <Link to="/" className="inline-flex items-center text-blue-500 hover:text-blue-400 mb-8">
          <ChevronLeft className="w-5 h-5 mr-2" />
          Back to Search
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">
                {mediaType === 'movie' ? 'Movie' : 'TV Show'} Player
              </h1>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value as typeof provider)}
                className="bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="embedder">Embedder</option>
                <option value="ultraembed">UltraEmbed</option>
                <option value="vidIngles">VidIngles</option>
                <option value="vidPremium">VidPremium</option>
              </select>
            </div>
            <div className="aspect-video bg-black rounded-xl overflow-hidden">
              <iframe
                src={getEmbedUrl()}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          </div>

          {mediaType === 'tv' && (
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4">
                {tvDetails?.name} - Episodes
              </h2>

              <div className="flex gap-4 mb-6">
                <select
                  value={selectedSeason}
                  onChange={(e) => {
                    const season = parseInt(e.target.value);
                    setSelectedSeason(season);
                    setSearchParams({ type: 'tv', season: season.toString(), episode: '1' });
                  }}
                  className="bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {tvDetails?.seasons.map((season) => (
                    <option key={season.id} value={season.season_number}>
                      Season {season.season_number}
                    </option>
                  ))}
                </select>

                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search episodes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {filteredEpisodes.map((episode) => (
                  <button
                    key={episode.id}
                    onClick={() => {
                      setSelectedEpisode(episode.episode_number);
                      setSearchParams({
                        type: 'tv',
                        season: selectedSeason.toString(),
                        episode: episode.episode_number.toString(),
                      });
                    }}
                    className={`w-full text-left p-4 rounded-lg transition-colors ${
                      selectedEpisode === episode.episode_number
                        ? 'bg-blue-600'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <div className="font-semibold">
                      Episode {episode.episode_number}: {episode.name}
                    </div>
                    <div className="text-sm text-gray-400 mt-1 line-clamp-2">
                      {episode.overview}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}