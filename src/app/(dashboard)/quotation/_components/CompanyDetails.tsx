'use client';
import React from 'react';

type CompanyDetailsProps = {
  form: {
    companyName: string;
    companyPhone: string;
    companyEmail: string;
  };
};

const CompanyDetails: React.FC<CompanyDetailsProps> = ({ form }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Detalles de la Empresa</h3>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          Datos del perfil
        </span>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Nombre de la Empresa</label>
          <input
            type="text"
            value={form.companyName}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed h-auto"
            placeholder="Nombre de la empresa"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Email</label>
          <input
            type="email"
            value={form.companyEmail}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed h-auto"
            placeholder="Email de la empresa"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Teléfono</label>
          <input
            type="text"
            value={form.companyPhone}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed h-auto"
            placeholder="Teléfono de la empresa"
          />
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
