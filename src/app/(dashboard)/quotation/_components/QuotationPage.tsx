'use client';
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useQuotes } from '@/hooks/Quotes/useQuotes';
import { useQuotePDF } from '@/hooks/Quotes/useQuotePDF';
import { useProducts } from '@/hooks/Products/useProducts';
import { useStoreProfile } from '@/hooks/StoreProfile/useStoreProfile';
import { ProductQuote } from '@/types/quote';
import { Product } from '@/types/ecomerce';
import QuotePreviewModal from '@/components/Quotes/QuotePreviewModal';
import { usePerson } from '@/hooks/Person/usePerson';
import { useAddress } from '@/hooks/Address/useAddress';
import { useAuthStore } from '@/stores/authStore';
import QuotationHeader from './QuotationHeader';
import QuotationTabs from './QuotationTabs';
import QuotationForm from './QuotationForm';
import HistoryView from './HistoryView';

// -----------------
// Main component
// -----------------

const QuotationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('quotation');
  const [selectedQuote, setSelectedQuote] = useState<ProductQuote | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { person } = usePerson();
  const { address } = useAddress(person?.Address?.id || 0);
  const email = useAuthStore((state) => state.user);

  // Memoizar el estado inicial del formulario para evitar recreaciones innecesarias
  const initialForm = useMemo(() => ({
    clientName: '',
    clientAddress: '',
    clientPhone: '',
    clientEmail: '',
    companyName: '',
    companyEmail: '',
    companyPhone: '',
    companyAddress: '',
    quoteDate: new Date().toISOString().split('T')[0],
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: '',
    termsConditions: 'Esta cotización es válida por 30 días desde la fecha de emisión.',
    items: [{ quantity: 1, unitPrice: 0, productSku: '', itemDiscount: 0, itemNotes: '' }]
  }), []);

  const [form, setForm] = useState(initialForm);

  const { products } = useProducts();
  const { generateAndDownloadPDF } = useQuotePDF();
  const { storeProfile, loading: storeProfileLoading } = useStoreProfile();

  const { 
    quotes, 
    loading, 
    error, 
    createQuote, 
    deleteQuote, 
    updateQuoteStatus, 
    searchQuotes, 
    clearError,
  } = useQuotes(storeProfile?.id);

  // Autocompletar campos de empresa con datos del perfil de la tienda
  useEffect(() => {
    if (storeProfile && !storeProfileLoading) {
      setForm(prev => ({
        ...prev,
        companyName: String(storeProfile.name || prev.companyName),
        companyEmail: String(email?.email || prev.companyEmail),
        companyPhone: String(storeProfile.phone || prev.companyPhone),
        companyAddress: String(address?.street || prev.companyAddress)
      }));
    }
  }, [storeProfile, storeProfileLoading, email?.email, address?.street]);

  // Memoizar handlers para evitar re-renders innecesarios
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

  const addItem = useCallback(() => {
    setForm(prev => ({ 
      ...prev, 
      items: [...prev.items, { quantity: 1, unitPrice: 0, productSku: '', itemDiscount: 0, itemNotes: '' }] 
    }));
  }, []);

  const removeItem = useCallback((index: number) => {
    setForm(prev => ({ 
      ...prev, 
      items: prev.items.length > 1 ? prev.items.filter((_, i: number) => i !== index) : prev.items 
    }));
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
        setForm(initialForm);
        setActiveTab('history');
        alert('Cotización creada exitosamente');
      }
    } catch (err) {
      console.error('Error al crear cotización:', err);
    } finally {
      setIsSubmitting(false);
    }
  }, [createQuote, form, initialForm]);

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

  // Memoizar el contenido de la pestaña activa para evitar re-renders innecesarios
  const activeTabContent = useMemo(() => {
    if (activeTab === 'quotation') {
      return (
        <QuotationForm
          form={form}
          onInputChange={handleInputChange}
          onItemChange={handleItemChange}
          onAddItem={addItem}
          onRemoveItem={removeItem}
          isSubmitting={isSubmitting}
          onCreateQuote={handleCreateQuote}
          products={products}
        />
      );
    }
    
    return (
      <HistoryView
        quotes={quotes}
        loading={loading}
        error={error}
        searchTerm={searchTerm}
        onSearch={handleSearch}
        onPreview={openPreviewModal}
        onDownload={handleDownloadPDF}
        onEdit={handleEditQuote}
        onDelete={handleDeleteQuote}
        onClearError={clearError}
      />
    );
  }, [
    activeTab, 
    form, 
    handleInputChange, 
    handleItemChange, 
    addItem, 
    removeItem, 
    isSubmitting, 
    handleCreateQuote, 
    products, 
    quotes, 
    loading, 
    error, 
    searchTerm, 
    handleSearch, 
    openPreviewModal, 
    handleDownloadPDF, 
    handleEditQuote, 
    handleDeleteQuote, 
    clearError
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <QuotationHeader />
      
      <QuotationTabs 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        quotesCount={quotes.length}
      />

      <div className="py-6">
        {activeTabContent}
      </div>

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
