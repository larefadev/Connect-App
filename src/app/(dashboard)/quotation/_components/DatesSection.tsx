'use client';
import React from 'react';

type DatesSectionProps = {
  form: {
    quoteDate: string;
    expirationDate: string;
  };
  onInputChange: (field: string, value: string) => void;
};

const DatesSection: React.FC<DatesSectionProps> = ({ form, onInputChange }) => {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm text-gray-600 mb-1">Fecha de Cotización</label>
        <input
          type="date"
          value={form.quoteDate}
          onChange={(e) => onInputChange('quoteDate', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 h-auto"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-1">Fecha de Expiración</label>
        <input
          type="date"
          value={form.expirationDate}
          onChange={(e) => onInputChange('expirationDate', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 h-auto"
        />
      </div>
    </div>
  );
};

export default DatesSection;
