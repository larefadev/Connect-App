'use client';
import React from 'react';
import { Store } from 'lucide-react';

const QuotationHeader: React.FC = () => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <Store className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Cotizaciones</h1>
            <p className="text-sm text-gray-500">Gestiona tus cotizaciones y presupuestos</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationHeader;
