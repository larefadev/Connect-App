'use client';
import React from 'react';

type QuotationTabsProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
  quotesCount: number;
};

const QuotationTabs: React.FC<QuotationTabsProps> = ({ 
  activeTab, 
  onTabChange, 
  quotesCount 
}) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex space-x-8">
          <button
            onClick={() => onTabChange('quotation')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'quotation' 
                ? 'border-red-500 text-red-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Nueva Cotización
          </button>
          <button
            onClick={() => onTabChange('history')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'history' 
                ? 'border-red-500 text-red-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Historial ({quotesCount})
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuotationTabs;
