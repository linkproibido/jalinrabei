import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 flex flex-col items-center justify-center">
      {/* Hero Section */}
      <div className="relative h-[30vh] md:h-[25vh] bg-gradient-to-b from-purple-900/20 via-blue-900/20 to-[#0a0a0a] flex items-center justify-center px-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1604147495798-57beb5d6af73?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-5"></div>
          <div className="absolute inset-0 bg-grid-pattern"></div>
        </div>
        <div className="relative z-10 w-full max-w-2xl text-center">
          <h1 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 animate-gradient">
            Página Não Encontrada
          </h1>
          <p className="mt-4 text-lg text-gray-300">
            Desculpe, mas a página que você está procurando não existe.
          </p>
          <Link to="/" className="mt-6 inline-block px-6 py-3 bg-purple-600 rounded-xl text-white hover:bg-purple-500 transition-colors">
            Voltar para a Página Inicial
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-4 text-gray-400 text-sm border-t border-gray-800/50">
        NÃO HOSPEDAMOS NENHUM CONTEÚDO EM NOSSOS SERVIDORES!
      </footer>
    </div>
  );
};

export default NotFoundPage;
