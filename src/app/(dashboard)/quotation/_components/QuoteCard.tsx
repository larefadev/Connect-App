'use client';
import React from 'react';
import { FileText, Eye, Download, Edit, Trash2 } from 'lucide-react';
import { ProductQuote } from '@/types/quote';

type QuoteCardProps = {
  quote: ProductQuote;
  onPreview: (quote: ProductQuote) => void;
  onDownload: (quote: ProductQuote) => void;
  onEdit: (quote: ProductQuote) => void;
  onDelete: (quoteId: string) => void;
};

const QuoteCard: React.FC<QuoteCardProps> = ({
  quote,
  onPreview,
  onDownload,
  onEdit,
  onDelete
}) => {
  const getStatusInfo = (status: string) => {
    const statusMap = {
      draft: { label: 'BORRADOR', bgColor: 'bg-gray-500' },
      sent: { label: 'ENVIADA', bgColor: 'bg-blue-500' },
      approved: { label: 'APROBADA', bgColor: 'bg-green-500' },
      rejected: { label: 'RECHAZADA', bgColor: 'bg-red-500' },
      expired: { label: 'EXPIRADA', bgColor: 'bg-yellow-500' }
    };
    
    return statusMap[status as keyof typeof statusMap] || statusMap.draft;
  };

  const statusInfo = getStatusInfo(quote.status || 'draft');

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <FileText className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{quote.quote_number}</div>
            <div className="text-sm text-gray-500">
              {quote.client?.name || 'Cliente no especificado'}
            </div>
            <div className="text-xs text-gray-400">
              {new Date(quote.created_at || '').toLocaleDateString('es-MX')}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${statusInfo.bgColor}`}>
            {statusInfo.label}
          </span>
          <div className="flex gap-1">
            <button 
              onClick={() => onPreview(quote)} 
              className="p-2 text-gray-400 hover:text-gray-600" 
              title="Ver detalles"
            >
              <Eye size={16} />
            </button>
            <button 
              onClick={() => onDownload(quote)} 
              className="p-2 text-gray-400 hover:text-gray-600" 
              title="Descargar PDF"
            >
              <Download size={16} />
            </button>
            <button 
              onClick={() => onEdit(quote)} 
              className="p-2 text-gray-400 hover:text-gray-600" 
              title="Editar"
            >
              <Edit size={16} />
            </button>
            <button 
              onClick={() => onDelete(quote.id!)} 
              className="p-2 text-red-400 hover:text-red-600" 
              title="Eliminar"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteCard;
