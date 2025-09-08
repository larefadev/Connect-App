'use client';
import React from 'react';

type ClientDetailsProps = {
  form: {
    clientName: string;
    clientAddress: string;
    clientPhone: string;
    clientEmail: string;
  };
  onInputChange: (field: string, value: string) => void;
};

const ClientDetails: React.FC<ClientDetailsProps> = ({ form, onInputChange }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Detalles del Cliente</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Nombre *</label>
          <input
            type="text"
            value={form.clientName}
            onChange={(e) => onInputChange('clientName', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 h-auto"
            placeholder="Nombre del cliente"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Dirección</label>
          <input
            type="text"
            value={form.clientAddress}
            onChange={(e) => onInputChange('clientAddress', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 h-auto"
            placeholder="Dirección del cliente"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Teléfono Móvil</label>
          <input
            type="text"
            value={form.clientPhone}
            onChange={(e) => onInputChange('clientPhone', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 h-auto"
            placeholder="Teléfono del cliente"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Email</label>
          <input
            type="email"
            value={form.clientEmail}
            onChange={(e) => onInputChange('clientEmail', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 h-auto"
            placeholder="Email del cliente"
          />
        </div>
      </div>
    </div>
  );
};

export default ClientDetails;
