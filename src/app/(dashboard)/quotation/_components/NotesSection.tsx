'use client';
import React from 'react';

type NotesSectionProps = {
  form: {
    notes: string;
    termsConditions: string;
  };
  onInputChange: (field: string, value: string) => void;
};

const NotesSection: React.FC<NotesSectionProps> = ({ form, onInputChange }) => {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm text-gray-600 mb-1">Notas Adicionales</label>
        <textarea
          value={form.notes}
          onChange={(e) => onInputChange('notes', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          rows={4}
          placeholder="Notas adicionales para el cliente"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-1">Términos y Condiciones</label>
        <textarea
          value={form.termsConditions}
          onChange={(e) => onInputChange('termsConditions', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          rows={4}
          placeholder="Términos y condiciones de la cotización"
        />
      </div>
    </div>
  );
};

export default NotesSection;
