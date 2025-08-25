import React, { useState } from 'react';
import { X, Edit, Download, Share, Eye, Calendar, User, Building } from 'lucide-react';
import { ProductQuote, QuoteItem } from '@/types/quote';
import { useQuotePDF } from '@/hooks/Quotes/useQuotePDF';

interface QuotePreviewModalProps {
  quote: ProductQuote | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (quote: ProductQuote) => void;
  onStatusChange: (quoteId: string, status: ProductQuote['status']) => void;
}

const QuotePreviewModal: React.FC<QuotePreviewModalProps> = ({
  quote,
  isOpen,
  onClose,
  onEdit,
  onStatusChange
}) => {
  const { generateAndDownloadPDF, openPDFInNewTab } = useQuotePDF();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  if (!isOpen || !quote) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500';
      case 'sent': return 'bg-blue-500';
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'expired': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'BORRADOR';
      case 'sent': return 'ENVIADA';
      case 'approved': return 'APROBADA';
      case 'rejected': return 'RECHAZADA';
      case 'expired': return 'EXPIRADA';
      default: return 'BORRADOR';
    }
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      await generateAndDownloadPDF(quote);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleViewPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      await openPDFInNewTab(quote);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleStatusChange = (newStatus: ProductQuote['status']) => {
    onStatusChange(quote.id!, newStatus);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Building className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Cotización {quote.quote_number}
              </h2>
              <p className="text-sm text-gray-500">
                Vista previa y gestión de la cotización
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Fecha</span>
              </div>
              <p className="text-gray-900">{formatDate(quote.quote_date || '')}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Cliente</span>
              </div>
              <p className="text-gray-900">{quote.client?.name || 'N/A'}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Building className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Empresa</span>
              </div>
              <p className="text-gray-900">{quote.company?.name || 'N/A'}</p>
            </div>
          </div>

          {/* Estado y acciones */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Estado:</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(quote.status)}`}>
                {getStatusText(quote.status)}
              </span>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(quote)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Edit size={16} />
                Editar
              </button>
              
              <button
                onClick={handleViewPDF}
                disabled={isGeneratingPDF}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                <Eye size={16} />
                {isGeneratingPDF ? 'Generando...' : 'Vista previa'}
              </button>
              
              <button
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                <Download size={16} />
                {isGeneratingPDF ? 'Generando...' : 'Descargar PDF'}
              </button>
            </div>
          </div>

          {/* Cambiar estado */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Cambiar Estado</h3>
            <div className="flex gap-2">
              {(['draft', 'sent', 'approved', 'rejected', 'expired'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  disabled={quote.status === status}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    quote.status === status
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {getStatusText(status)}
                </button>
              ))}
            </div>
          </div>

          {/* Detalles del cliente */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Información del Cliente</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-xs text-gray-500">Nombre:</span>
                  <p className="text-gray-900">{quote.client?.name || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Dirección:</span>
                  <p className="text-gray-900">{quote.client?.address || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Teléfono:</span>
                  <p className="text-gray-900">{quote.client?.mobile_phone || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Email:</span>
                  <p className="text-gray-900">{quote.client?.email || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Información de la Empresa</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-xs text-gray-500">Nombre:</span>
                  <p className="text-gray-900">{quote.company?.name || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Dirección:</span>
                  <p className="text-gray-900">{quote.company?.address || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Teléfono:</span>
                  <p className="text-gray-900">{quote.company?.phone || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Email:</span>
                  <p className="text-gray-900">{quote.company?.email || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabla de productos */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-700">Productos y Servicios</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cantidad
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio Unit.
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descuento
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {quote.items?.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {item.product_sku || `Producto ${index + 1}`}
                          </div>
                          {item.item_notes && (
                            <div className="text-sm text-gray-500">{item.item_notes}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        {formatCurrency(item.unit_price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        {formatCurrency(item.item_discount || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                        {formatCurrency((item.quantity * item.unit_price) - (item.item_discount || 0))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totales */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-end">
              <div className="w-64 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">{formatCurrency(quote.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">IVA (16%):</span>
                  <span className="font-medium">{formatCurrency(quote.taxes)}</span>
                </div>
                {quote.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Descuento:</span>
                    <span className="font-medium">-{formatCurrency(quote.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold text-red-600 border-t pt-3">
                  <span>TOTAL:</span>
                  <span>{formatCurrency(quote.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notas y términos */}
          {(quote.notes || quote.terms_conditions) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quote.notes && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Notas</h3>
                  <p className="text-gray-900 text-sm">{quote.notes}</p>
                </div>
              )}
              
              {quote.terms_conditions && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Términos y Condiciones</h3>
                  <p className="text-gray-900 text-sm">{quote.terms_conditions}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Creada el {formatDate(quote.created_at || '')}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotePreviewModal;
