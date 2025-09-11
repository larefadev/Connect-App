'use client';
import React, { useMemo } from 'react';
import { Product } from '@/types/ecomerce';
import ClientDetails from './ClientDetails';
import CompanyDetails from './CompanyDetails';
import DatesSection from './DatesSection';
import ItemsSection from './ItemsSection';
import NotesSection from './NotesSection';
import TotalsSection from './TotalsSection';

type QuotationFormProps = {
  form: {
    clientName: string;
    clientAddress: string;
    clientPhone: string;
    clientEmail: string;
    companyName: string;
    companyPhone: string;
    companyEmail: string;
    quoteDate: string;
    expirationDate: string;
    notes: string;
    termsConditions: string;
    items: Array<{
      productSku: string;
      productName?: string;
      quantity: number;
      unitPrice: number;
      itemDiscount: number;
      itemNotes: string;
    }>;
  };
  onInputChange: (field: string, value: string | number) => void;
  onItemChange: (index: number, field: string, value: string | number) => void;
  onRemoveItem: (index: number) => void;
  onOpenAddProductModal: () => void;
  isSubmitting: boolean;
  onCreateQuote: () => Promise<void>;
  products: Product[];
};

const QuotationForm: React.FC<QuotationFormProps> = ({
  form,
  onInputChange,
  onItemChange,
  onRemoveItem,
  onOpenAddProductModal,
  isSubmitting,
  onCreateQuote,
  products
}) => {
  // Memoizar cálculos de totales para evitar recálculos innecesarios
  const { subtotal, taxes, total } = useMemo(() => {
    const subtotal = form.items.reduce(
      (sum: number, item) => sum + (item.quantity * item.unitPrice) - (item.itemDiscount || 0), 
      0
    );
    const taxes = subtotal * 0.16;
    const total = subtotal + taxes;
    return { subtotal, taxes, total };
  }, [form.items]);

  // Memoizar si se puede enviar el formulario
  const canSubmit = useMemo(() => {
    return form.clientName.trim() !== '' && form.items.length > 0;
  }, [form.clientName, form.items.length]);

  // Memoizar datos del cliente para evitar re-renders innecesarios
  const clientData = useMemo(() => ({
    clientName: form.clientName,
    clientAddress: form.clientAddress,
    clientPhone: form.clientPhone,
    clientEmail: form.clientEmail
  }), [form.clientName, form.clientAddress, form.clientPhone, form.clientEmail]);

  // Memoizar datos de la empresa
  const companyData = useMemo(() => ({
    companyName: form.companyName,
    companyPhone: form.companyPhone,
    companyEmail: form.companyEmail
  }), [form.companyName, form.companyPhone, form.companyEmail]);

  // Memoizar datos de fechas
  const datesData = useMemo(() => ({
    quoteDate: form.quoteDate,
    expirationDate: form.expirationDate
  }), [form.quoteDate, form.expirationDate]);

  // Memoizar datos de notas
  const notesData = useMemo(() => ({
    notes: form.notes,
    termsConditions: form.termsConditions
  }), [form.notes, form.termsConditions]);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ClientDetails 
          form={clientData} 
          onInputChange={onInputChange} 
        />
        <CompanyDetails form={companyData} />
      </div>

      <DatesSection 
        form={datesData} 
        onInputChange={onInputChange} 
      />

      <ItemsSection
        items={form.items}
        products={products}
        onItemChange={onItemChange}
        onRemoveItem={onRemoveItem}
        onOpenAddProductModal={onOpenAddProductModal}
      />

      <NotesSection 
        form={notesData} 
        onInputChange={onInputChange} 
      />

      <TotalsSection
        subtotal={subtotal}
        taxes={taxes}
        total={total}
        isSubmitting={isSubmitting}
        canSubmit={canSubmit}
        onCreateQuote={onCreateQuote}
      />
    </div>
  );
};

export default QuotationForm;
