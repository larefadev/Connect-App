'use client';
import React from 'react';

type TotalsSectionProps = {
  subtotal: number;
  taxes: number;
  total: number;
  isSubmitting: boolean;
  canSubmit: boolean;
  onCreateQuote: () => Promise<void>;
};

const TotalsSection: React.FC<TotalsSectionProps> = ({
  subtotal,
  taxes,
  total,
  isSubmitting,
  canSubmit,
  onCreateQuote
}) => {
  return (
    <div className="mt-8 flex justify-between items-center">
      <div></div>
      <div className="text-right">
        <div className="space-y-2 mb-4">
          <div className="text-lg">Sub Total: ${subtotal.toFixed(2)}</div>
          <div className="text-lg">IVA (16%): ${taxes.toFixed(2)}</div>
          <div className="text-xl font-bold text-red-600">TOTAL: ${total.toFixed(2)}</div>
        </div>
        <button
          onClick={onCreateQuote}
          disabled={isSubmitting || !canSubmit}
          className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Creando...' : 'Crear Cotización'}
        </button>
      </div>
    </div>
  );
};

export default TotalsSection;
