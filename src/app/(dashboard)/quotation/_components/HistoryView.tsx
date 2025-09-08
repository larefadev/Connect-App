'use client';
import React, { useMemo } from 'react';
import { Search, FileText } from 'lucide-react';
import { ProductQuote } from '@/types/quote';
import QuoteCard from './QuoteCard';

type HistoryViewProps = {
  quotes: ProductQuote[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  onSearch: (term: string) => void;
  onPreview: (quote: ProductQuote) => void;
  onDownload: (quote: ProductQuote) => void;
  onEdit: (quote: ProductQuote) => void;
  onDelete: (quoteId: string) => void;
  onClearError: () => void;
};

const HistoryView: React.FC<HistoryViewProps> = ({
  quotes,
  loading,
  error,
  searchTerm,
  onSearch,
  onPreview,
  onDownload,
  onEdit,
  onDelete,
  onClearError
}) => {
  // Memoizar las cotizaciones filtradas para evitar filtrado innecesario
  const filteredQuotes = useMemo(() => {
    if (!searchTerm.trim()) return quotes;
    return quotes.filter(quote => 
      quote.quote_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.client?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [quotes, searchTerm]);

  // Memoizar el estado de carga
  const loadingState = useMemo(() => (
    <div className="text-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
      <p className="mt-4 text-gray-600">Cargando cotizaciones...</p>
    </div>
  ), []);

  // Memoizar el estado de error
  const errorState = useMemo(() => (
    <div className="text-center py-8">
      <p className="text-red-600 mb-4">{error}</p>
      <button 
        onClick={onClearError} 
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
      >
        Reintentar
      </button>
    </div>
  ), [error, onClearError]);

  // Memoizar el estado vacío
  const emptyState = useMemo(() => (
    <div className="text-center py-8">
      <FileText className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">No hay cotizaciones</h3>
      <p className="mt-1 text-sm text-gray-500">Comienza creando tu primera cotización.</p>
    </div>
  ), []);

  // Memoizar la lista de cotizaciones
  const quotesList = useMemo(() => (
    <div className="space-y-4">
      {filteredQuotes.map((quote) => (
        <QuoteCard
          key={quote.id}
          quote={quote}
          onPreview={onPreview}
          onDownload={onDownload}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  ), [filteredQuotes, onPreview, onDownload, onEdit, onDelete]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div></div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar cotizaciones..."
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 w-64 h-auto"
            />
          </div>
        </div>
      </div>

      {loading ? loadingState : 
       error ? errorState : 
       filteredQuotes.length === 0 ? emptyState : 
       quotesList}
    </div>
  );
};

export default HistoryView;
