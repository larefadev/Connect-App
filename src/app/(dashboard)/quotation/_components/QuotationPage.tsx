'use client';
import React, { useState, useCallback, useMemo } from 'react';
import { Store, Plus, X, Search, FileText, Edit, Eye, Download, Trash2 } from 'lucide-react';
import { useQuotes } from '@/hooks/Quotes/useQuotes';
import { useQuotePDF } from '@/hooks/Quotes/useQuotePDF';
import { useProducts } from '@/hooks/Products/useProducts';
import { ProductQuote } from '@/types/quote';
import { Product } from '@/types/ecomerce';
import QuotePreviewModal from '@/components/Quotes/QuotePreviewModal';

// -----------------
// Child components
// -----------------

type QuotationFormProps = {
  form: {
    clientName: string;
    clientAddress: string;
    clientPhone: string;
    clientEmail: string;
    companyName: string;
    companyAddress: string;
    companyPhone: string;
    companyEmail: string;
    quoteDate: string;
    expirationDate: string;
    notes: string;
    termsConditions: string;
    items: Array<{
      productSku: string;
      quantity: number;
      unitPrice: number;
      itemDiscount: number;
      itemNotes: string;
    }>;
  };
  handleInputChange: (field: string, value: string | number) => void;
  handleItemChange: (index: number, field: string, value: string | number) => void;
  addItem: () => void;
  removeItem: (index: number) => void;
  subtotal: number;
  taxes: number;
  total: number;
  isSubmitting: boolean;
  handleCreateQuote: () => Promise<void>;
  products: Product[];
};

export const QuotationForm: React.FC<QuotationFormProps> = ({
  form,
  handleInputChange,
  handleItemChange,
  addItem,
  removeItem,
  subtotal,
  taxes,
  total,
  isSubmitting,
  handleCreateQuote,
  products
}) => {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Customer Details */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Detalles del Cliente</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Nombre *</label>
              <input
                type="text"
                value={form.clientName}
                onChange={(e) => handleInputChange('clientName', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 h-auto"
                placeholder="Nombre del cliente"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Dirección</label>
              <input
                type="text"
                value={form.clientAddress}
                onChange={(e) => handleInputChange('clientAddress', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 h-auto"
                placeholder="Dirección del cliente"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Teléfono Móvil</label>
              <input
                type="text"
                value={form.clientPhone}
                onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 h-auto"
                placeholder="Teléfono del cliente"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input
                type="email"
                value={form.clientEmail}
                onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 h-auto"
                placeholder="Email del cliente"
              />
            </div>
          </div>
        </div>

        {/* Company Details */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Detalles de la Empresa</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Nombre de la Empresa</label>
              <input
                type="text"
                value={form.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 h-auto"
                placeholder="Nombre de la empresa"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input
                type="email"
                value={form.companyEmail}
                onChange={(e) => handleInputChange('companyEmail', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 h-auto"
                placeholder="Email de la empresa"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Teléfono</label>
              <input
                type="text"
                value={form.companyPhone}
                onChange={(e) => handleInputChange('companyPhone', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 h-auto"
                placeholder="Teléfono de la empresa"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Dirección</label>
              <input
                type="text"
                value={form.companyAddress}
                onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 h-auto"
                placeholder="Dirección de la empresa"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Fechas */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Fecha de Cotización</label>
          <input
            type="date"
            value={form.quoteDate}
            onChange={(e) => handleInputChange('quoteDate', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 h-auto"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Fecha de Expiración</label>
          <input
            type="date"
            value={form.expirationDate}
            onChange={(e) => handleInputChange('expirationDate', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 h-auto"
          />
        </div>
      </div>

      {/* Items Section */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Artículos</h3>
        <div className="space-y-3">
          {/* Header */}
          <div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-600">
            <div className="col-span-4">Producto</div>
            <div className="col-span-2 text-center">Cantidad</div>
            <div className="col-span-2 text-right">Precio Unit.</div>
            <div className="col-span-2 text-right">Descuento</div>
            <div className="col-span-1 text-right">Subtotal</div>
            <div className="col-span-1"></div>
          </div>

          {form.items.map((item, index: number) => (
            <div key={`item-row-${index}`} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-4">
                <select
                  value={item.productSku}
                  onChange={(e) => handleItemChange(index, 'productSku', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50 focus:outline-none focus:ring-1 focus:ring-red-500"
                >
                  <option value="">Seleccionar producto</option>
                  {products.map((product) => (
                    <option key={product.SKU} value={product.SKU}>
                      {product.Nombre || 'Sin nombre'} - {product.SKU}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={item.itemNotes}
                  onChange={(e) => handleItemChange(index, 'itemNotes', e.target.value)}
                  className="w-full p-1 mt-1 text-xs border border-gray-200 rounded bg-gray-50 focus:outline-none focus:ring-1 focus:ring-red-500 h-auto"
                  placeholder="Notas adicionales"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-center focus:outline-none focus:ring-1 focus:ring-red-500 h-auto"
                  min={1}
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-right focus:outline-none focus:ring-1 focus:ring-red-500 h-auto"
                  step="0.01"
                  min={0}
                  readOnly
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  value={item.itemDiscount}
                  onChange={(e) => handleItemChange(index, 'itemDiscount', parseFloat(e.target.value) || 0)}
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-right focus:outline-none focus:ring-1 focus:ring-red-500 h-auto"
                  min={0}
                />
              </div>
              <div className="col-span-1 text-right text-sm font-medium">${((item.quantity * item.unitPrice) - (item.itemDiscount || 0)).toFixed(2)}</div>
              <div className="col-span-1">
                <button onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700 p-1">
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}

          {/* Add Product Button */}
          <button
            onClick={addItem}
            className="w-full p-3 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-red-500 hover:text-red-500 transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            Agregar Producto
          </button>
        </div>
      </div>

      {/* Notas y Términos */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Notas Adicionales</label>
          <textarea
            value={form.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            rows={4}
            placeholder="Notas adicionales para el cliente"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Términos y Condiciones</label>
          <textarea
            value={form.termsConditions}
            onChange={(e) => handleInputChange('termsConditions', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            rows={4}
            placeholder="Términos y condiciones de la cotización"
          />
        </div>
      </div>

      {/* Totales y Botón de Crear */}
      <div className="mt-8 flex justify-between items-center">
        <div></div>
        <div className="text-right">
          <div className="space-y-2 mb-4">
            <div className="text-lg">Sub Total: ${subtotal.toFixed(2)}</div>
            <div className="text-lg">IVA (16%): ${taxes.toFixed(2)}</div>
            <div className="text-xl font-bold text-red-600">TOTAL: ${total.toFixed(2)}</div>
          </div>
          <button
            onClick={handleCreateQuote}
            disabled={isSubmitting || !form.clientName || form.items.length === 0}
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creando...' : 'Crear Cotización'}
          </button>
        </div>
      </div>
    </div>
  );
};

// -----------------
// HistoryView
// -----------------

type HistoryViewProps = {
  quotes: ProductQuote[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  onSearch: (term: string) => void;
  openPreviewModal: (quote: ProductQuote) => void;
  handleDownloadPDF: (quote: ProductQuote) => void;
  handleEditQuote: (quote: ProductQuote) => void;
  handleDeleteQuote: (quoteId: string) => void;
  clearError: () => void;
};

export const HistoryView: React.FC<HistoryViewProps> = ({
  quotes,
  loading,
  error,
  searchTerm,
  onSearch,
  openPreviewModal,
  handleDownloadPDF,
  handleEditQuote,
  handleDeleteQuote,
  clearError
}) => {
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

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando cotizaciones...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={clearError} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Reintentar</button>
        </div>
      ) : quotes.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay cotizaciones</h3>
          <p className="mt-1 text-sm text-gray-500">Comienza creando tu primera cotización.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {quotes.map((quote) => (
            <div key={quote.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{quote.quote_number}</div>
                    <div className="text-sm text-gray-500">{quote.client?.name || 'Cliente no especificado'}</div>
                    <div className="text-xs text-gray-400">{new Date(quote.created_at || '').toLocaleDateString('es-MX')}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                    quote.status === 'draft' ? 'bg-gray-500' :
                    quote.status === 'sent' ? 'bg-blue-500' :
                    quote.status === 'approved' ? 'bg-green-500' :
                    quote.status === 'rejected' ? 'bg-red-500' :
                    quote.status === 'expired' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`}>
                    {quote.status === 'draft' ? 'BORRADOR' :
                     quote.status === 'sent' ? 'ENVIADA' :
                     quote.status === 'approved' ? 'APROBADA' :
                     quote.status === 'rejected' ? 'RECHAZADA' :
                     quote.status === 'expired' ? 'EXPIRADA' : 'BORRADOR'}
                  </span>
                  <div className="flex gap-1">
                    <button onClick={() => openPreviewModal(quote)} className="p-2 text-gray-400 hover:text-gray-600" title="Ver detalles"><Eye size={16} /></button>
                    <button onClick={() => handleDownloadPDF(quote)} className="p-2 text-gray-400 hover:text-gray-600" title="Descargar PDF"><Download size={16} /></button>
                    <button onClick={() => handleEditQuote(quote)} className="p-2 text-gray-400 hover:text-gray-600" title="Editar"><Edit size={16} /></button>
                    <button onClick={() => handleDeleteQuote(quote.id!)} className="p-2 text-red-400 hover:text-red-600" title="Eliminar"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// -----------------
// Main component
// -----------------

const QuotationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('quotation');
  const [selectedQuote, setSelectedQuote] = useState<ProductQuote | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState(() => ({
    clientName: '',
    clientAddress: '',
    clientPhone: '',
    clientEmail: '',
    companyName: 'Auto Parts',
    companyEmail: 'autoparts.larefa.com',
    companyPhone: '1 888 235 8926',
    companyAddress: 'Av. Insurgentes Sur 1234',
    quoteDate: new Date().toISOString().split('T')[0],
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: '',
    termsConditions: 'Esta cotización es válida por 30 días desde la fecha de emisión.',
    items: [{ quantity: 1, unitPrice: 0, productSku: '', itemDiscount: 0, itemNotes: '' }]
  }));

  const { quotes, loading, error, createQuote, deleteQuote, updateQuoteStatus, searchQuotes, clearError } = useQuotes();
  const { products } = useProducts();
  const { generateAndDownloadPDF } = useQuotePDF();

  // Stable handlers so child components are pure and don't cause extra remounts
  const handleInputChange = useCallback((field: string, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleItemChange = useCallback((index: number, field: string, value: string | number) => {
    setForm(prev => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };

      if (field === 'productSku' && typeof value === 'string' && value.trim() !== '') {
        const selectedProduct = products.find(p => p.SKU === value);
        if (selectedProduct && selectedProduct.Precio && newItems[index].unitPrice === 0) {
          newItems[index].unitPrice = selectedProduct.Precio;
        }
      }

      return { ...prev, items: newItems };
    });
  }, [products]);

  const { subtotal, taxes, total } = useMemo(() => {
    const subtotal = form.items.reduce((sum: number, item) => sum + (item.quantity * item.unitPrice) - (item.itemDiscount || 0), 0);
    const taxes = subtotal * 0.16;
    const total = subtotal + taxes;
    return { subtotal, taxes, total };
  }, [form.items]);

  const addItem = useCallback(() => {
    setForm(prev => ({ ...prev, items: [...prev.items, { quantity: 1, unitPrice: 0, productSku: '', itemDiscount: 0, itemNotes: '' }] }));
  }, []);

  const removeItem = useCallback((index: number) => {
          setForm(prev => ({ ...prev, items: prev.items.length > 1 ? prev.items.filter((_, i: number) => i !== index) : prev.items }));
  }, []);

  const handleCreateQuote = useCallback(async () => {
    if (!form.clientName || form.items.length === 0) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    const quoteData = {
      client: {
        name: form.clientName,
        address: form.clientAddress,
        mobile_phone: form.clientPhone,
        email: form.clientEmail
      },
      company: {
        name: form.companyName,
        email: form.companyEmail,
        phone: form.companyPhone,
        address: form.companyAddress
      },
              items: form.items.map((item) => ({
        quantity: item.quantity,
        unit_price: item.unitPrice,
        product_sku: item.productSku,
        item_discount: item.itemDiscount,
        item_notes: item.itemNotes
      })),
      quote_date: form.quoteDate,
      expiration_date: form.expirationDate,
      notes: form.notes,
      terms_conditions: form.termsConditions
    };

    setIsSubmitting(true);
    try {
      const newQuote = await createQuote(quoteData);
      if (newQuote) {
        setForm({
          clientName: '',
          clientAddress: '',
          clientPhone: '',
          clientEmail: '',
          companyName: 'Auto Parts',
          companyEmail: 'autoparts.larefa.com',
          companyPhone: '1 888 235 8926',
          companyAddress: 'Av. Insurgentes Sur 1234',
          quoteDate: new Date().toISOString().split('T')[0],
          expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          notes: '',
          termsConditions: 'Esta cotización es válida por 30 días desde la fecha de emisión.',
          items: [{ quantity: 1, unitPrice: 0, productSku: '', itemDiscount: 0, itemNotes: '' }]
        });
        setActiveTab('history');
        alert('Cotización creada exitosamente');
      }
    } catch (err) {
      console.error('Error al crear cotización:', err);
    } finally {
      setIsSubmitting(false);
    }
  }, [createQuote, form]);

  const openPreviewModal = useCallback((quote: ProductQuote) => {
    setSelectedQuote(quote);
    setIsPreviewModalOpen(true);
  }, []);

  const closePreviewModal = useCallback(() => {
    setIsPreviewModalOpen(false);
    setSelectedQuote(null);
  }, []);

  const handleEditQuote = useCallback((quote: ProductQuote) => {
    console.log('Editar cotización:', quote);
  }, []);

  const handleStatusChange = useCallback(async (quoteId: string, status: ProductQuote['status']) => {
    const success = await updateQuoteStatus(quoteId, status);
    if (success) {
      closePreviewModal();
    }
  }, [updateQuoteStatus, closePreviewModal]);

  const handleDeleteQuote = useCallback(async (quoteId: string) => {
    if (confirm('¿Está seguro de que desea eliminar esta cotización?')) {
      const success = await deleteQuote(quoteId);
      if (success) {
        alert('Cotización eliminada exitosamente');
      }
    }
  }, [deleteQuote]);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      searchQuotes(term);
    }
  }, [searchQuotes]);

  const handleDownloadPDF = useCallback(async (quote: ProductQuote) => {
    try {
      await generateAndDownloadPDF(quote);
    } catch (error) {
      console.error('Error al descargar PDF:', error);
    }
  }, [generateAndDownloadPDF]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
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
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('quotation')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'quotation' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Nueva Cotización
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Historial ({quotes.length})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-6">
        {activeTab === 'quotation' ? (
          <QuotationForm
            form={form}
            handleInputChange={handleInputChange}
            handleItemChange={handleItemChange}
            addItem={addItem}
            removeItem={removeItem}
            subtotal={subtotal}
            taxes={taxes}
            total={total}
            isSubmitting={isSubmitting}
            handleCreateQuote={handleCreateQuote}
            products={products}
          />
        ) : (
          <HistoryView
            quotes={quotes}
            loading={loading}
            error={error}
            searchTerm={searchTerm}
            onSearch={handleSearch}
            openPreviewModal={openPreviewModal}
            handleDownloadPDF={handleDownloadPDF}
            handleEditQuote={handleEditQuote}
            handleDeleteQuote={handleDeleteQuote}
            clearError={clearError}
          />
        )}
      </div>

      {/* Modal de Vista Previa */}
      <QuotePreviewModal
        quote={selectedQuote}
        isOpen={isPreviewModalOpen}
        onClose={closePreviewModal}
        onEdit={handleEditQuote}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default QuotationPage;
