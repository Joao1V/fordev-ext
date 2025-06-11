import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
   return (
      <div className="flex flex-col items-center justify-center h-full">
         <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
            <h2 className="text-3xl font-semibold text-gray-700 mb-6">Página não encontrada</h2>
            <p className="text-gray-500 mb-8">
               A página que você está procurando não existe ou foi movida.
            </p>
            <Link
               to={'/'}
               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
               Voltar para a página inicial
            </Link>
         </div>
      </div>
   );
};

export default NotFound;
