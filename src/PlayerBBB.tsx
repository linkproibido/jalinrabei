import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Definindo as opções de ângulos do BBB
const bbbAngles = [
  {
    id: 'NPObbb1',
    name: 'Principal 1',
    embedUrl: 'https://nossoplayeronlinehd.com/tv/bbb1'
  },
  {
    id: 'NPObbb2',
    name: 'Principal 2',
    embedUrl: 'https://nossoplayeronlinehd.com/tv/bbb2'
  },
  {
    id: 'NPObbb3',
    name: 'Mosaico',
    embedUrl: 'https://nossoplayeronlinehd.com/tv/bbb3'
  },
  {
    id: 'NPObbb4',
    name: 'Quarto Fantastico',
    embedUrl: 'https://nossoplayeronlinehd.com/tv/bbb4'
  },
  {
    id: 'NPObbb5',
    name: 'Quarto Nordeste',
    embedUrl: 'https://nossoplayeronlinehd.com/tv/bbb5'
  },
  {
    id: 'NPObbb6',
    name: 'Quarto Anos 50',
    embedUrl: 'https://nossoplayeronlinehd.com/tv/bbb6'
  },
  {
    id: 'NPObbb7',
    name: 'Sala',
    embedUrl: 'https://nossoplayeronlinehd.com/tv/bbb7'
  },
  {
    id: 'NPObbb8',
    name: 'Cozinha',
    embedUrl: 'https://nossoplayeronlinehd.com/tv/bbb8'
  },
  {
    id: 'NPObbb9',
    name: 'Banheiro',
    embedUrl: 'https://nossoplayeronlinehd.com/tv/bbb9'
  },
  {
    id: 'NPObbb10',
    name: 'Cam 10',
    embedUrl: 'https://nossoplayeronlinehd.com/tv/bbb10'
  },
];

function PlayerBBB() {
  const [selectedAngle, setSelectedAngle] = useState(bbbAngles[0]);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
      {/* Header */}
      <header className="p-4 border-b border-gray-800/50">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500">
            BBB 2024 - Nosso Player Online
          </h1>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 text-sm bg-gray-900/50 rounded-lg border border-gray-800 hover:border-purple-500 transition-colors"
          >
            Voltar
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Player */}
        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden border border-gray-800/50 mb-6">
          <iframe
            src={selectedAngle.embedUrl}
            allowFullScreen
            className="w-full h-full"
            title={selectedAngle.name}
          ></iframe>
        </div>

        {/* Angle Selection */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {bbbAngles.map((angle) => (
            <button
              key={angle.id}
              onClick={() => setSelectedAngle(angle)}
              className={`p-3 rounded-lg border transition-all ${
                selectedAngle.id === angle.id
                  ? 'bg-purple-600/80 border-purple-500'
                  : 'bg-gray-900/50 border-gray-800/50 hover:border-purple-500'
              }`}
            >
              <span className="text-sm font-medium">{angle.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-4 text-gray-400 text-sm border-t border-gray-800/50">
        NÃO HOSPEDAMOS NENHUM CONTEÚDO EM NOSSOS SERVIDORES!
      </footer>
    </div>
  );
}

export default PlayerBBB;
