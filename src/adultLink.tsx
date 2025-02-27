import React, { useState, useEffect } from 'react';
import { Search, Loader2, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { usePopUnderAd, useInterstitialAd, BannerAd } from './components/AdManager';

// Interface para os resultados da busca do Google
interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  pagemap?: {
    cse_thumbnail?: { src: string }[];
  };
}

function AdultLink() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [page, setPage] = useState(1); // Página atual (começa em 1)
  const resultsPerPage = 10; // Número de resultados por página
  const navigate = useNavigate();

  // Initialize ads
  usePopUnderAd({
    siteId: 5277720,
    popundersPerIP: "5,1"
  });
  
  useInterstitialAd("8c9e42c8b9fb4376ad91c9351c4dd1e4");

  // Substitua com suas credenciais
  const API_KEY = 'AIzaSyBXRtLRmD0DopPTM01hsMkrbJwes0OsM3U'; // Obtenha no Google Cloud Console
  const CSE_ID = 'c4a1aefad0caf4baa'; // Obtenha no Google Custom Search

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(1); // Resetar para a primeira página ao mudar a busca
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const fetchAdultContent = async () => {
      if (debouncedQuery.trim()) {
        setLoading(true);
        setError(null);
        try {
          const startIndex = (page - 1) * resultsPerPage + 1; // Calcular o índice de início
          const response = await fetch(
            `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
              debouncedQuery + ' site:*.adult OR site:*.xxx OR site:*.porn -inurl:(login OR signup)'
            )}&key=${API_KEY}&cx=${CSE_ID}&num=${resultsPerPage}&start=${startIndex}`
          );
          const data = await response.json();
          if (data.items) {
            setResults(data.items);
          } else {
            setResults([]);
          }
        } catch (error) {
          console.error('Error fetching search results:', error);
          setError('Failed to fetch results. Please try again.');
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    };

    fetchAdultContent();
  }, [debouncedQuery, page]);

  const handleResultClick = (link: string) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.setAttribute('data-cfasync', 'false');
    script.text = `
      /*<![CDATA[/* */
      (function(){var b=window,w="b394f8e386f9f054d8c861674f5845f7",s=[["siteId",251+166+652+5164987],["minBid",0.001],["popundersPerIP","20,10"],["delayBetween",0],["default",false],["defaultPerDay",0],["topmostLayer","auto"]],f=["d3d3LmRpc3BsYXl2ZXJ0aXNpbmcuY29tL3BuYW5vYmFyLm1pbi5jc3M=","ZDNtem9rdHk5NTFjNXcuY2xvdWRmcm9udC5uZXQvSy9wdHVybi5taW4uanM="],u=-1,g,j,q=function(){clearTimeout(j);u++;if(f[u]&&!(1766305677000<(new Date).getTime()&&1<u)){g=b.document.createElement("script");g.type="text/javascript";g.async=!0;var y=b.document.getElementsByTagName("script")[0];g.src="https://"+atob(f[u]);g.crossOrigin="anonymous";g.onerror=q;g.onload=function(){clearTimeout(j);b[w.slice(0,16)+w.slice(0,16)]||q()};j=setTimeout(q,5E3);y.parentNode.insertBefore(g,y)}};if(!b[w]){try{Object.freeze(b[w]=s)}catch(e){}q()}})();
      /*]]>/* */
    `;
    document.body.appendChild(script);

    window.open(link, '_blank');
  };

  const handleNextPage = () => {
    setPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
      {/* Hero Section */}
      <div className="relative h-[30vh] md:h-[25vh] bg-gradient-to-b from-purple-900/20 via-blue-900/20 to-[#0a0a0a] flex items-center justify-center px-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1604147495798-57beb5d6af73?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-5"></div>
          <div className="absolute inset-0 bg-grid-pattern"></div>
        </div>
        <div className="relative z-10 w-full max-w-2xl">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-8 h-8 text-purple-500" />
            <h1 className="text-3xl md:text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 animate-gradient">
              ADULT LINK PROIBIDO
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
                placeholder="Search for adult content..."
                className="w-full pl-12 pr-4 py-3 bg-gray-900/90 backdrop-blur-sm rounded-xl border border-gray-800 focus:outline-none focus:border-purple-500 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Top Banner */}
        {results.length > 0 && (
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl border border-gray-800 backdrop-blur-sm flex justify-center">
            <iframe 
              width="300" 
              height="100" 
              frameBorder="0" 
              scrolling="no" 
              src="//tsyndicate.com/iframes2/22b5c57017c648a3a31ea68fe745fb3b.html?extid={extid}"
            ></iframe>
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
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
              {results.map((result, index) => (
                <div
                  key={index}
                  onClick={() => handleResultClick(result.link)}
                  className="group cursor-pointer bg-gray-900/50 rounded-lg overflow-hidden transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-900/20 border border-gray-800/50 backdrop-blur-sm"
                >
                  <div className="relative aspect-[2/3] overflow-hidden">
                    <img
                      src={result.pagemap?.cse_thumbnail?.[0]?.src || 'https://via.placeholder.com/500x750?text=Adult+Content'}
                      alt={result.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/500x750?text=Adult+Content';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-xs text-gray-300 line-clamp-3">{result.snippet}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold mb-1 line-clamp-1 group-hover:text-purple-400 transition-colors">
                      {result.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {results.length > 0 && (
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg border transition-colors ${
                    page === 1
                      ? 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed'
                      : 'bg-gray-900/50 text-white border-gray-800 hover:border-purple-500 hover:bg-purple-600/80'
                  }`}
                >
                  Anterior
                </button>
                <span className="flex items-center text-gray-400">
                  Página {page}
                </span>
                <button
                  onClick={handleNextPage}
                  className="px-4 py-2 text-sm font-semibold bg-gray-900/50 text-white rounded-lg border border-gray-800 hover:border-purple-500 hover:bg-purple-600/80 transition-colors"
                >
                  Próxima
                </button>
              </div>
            )}
          </div>
        )}

        {!loading && results.length === 0 && query.trim() !== '' && (
          <div className="text-center text-gray-400 bg-gray-900/50 p-6 rounded-xl border border-gray-800/50 backdrop-blur-sm">
            No results found for "{query}". Try a different search term.
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center py-4 text-gray-400 text-sm border-t border-gray-800/50">
        NÃO HOSPEDAMOS NENHUM CONTEÚDO EM NOSSOS SERVIDORES!
      </footer>
    </div>
  );
}

export default AdultLink;