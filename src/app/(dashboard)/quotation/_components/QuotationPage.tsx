'use client';
import React, { useState } from 'react';
import { Store, Plus, X, Search, FileText, Printer, Share, Edit, Repeat } from 'lucide-react';

// Mock data
const mockQuotations = [
  { id: '#123456', customer: 'Liam Smith', status: 'Enviada', statusColor: 'text-red-500' },
  { id: '#123458', customer: 'Liam Smith', status: 'Pendiente', statusColor: 'text-red-500' },
  { id: '#123456', customer: 'Liam Smith', status: 'Aceptada', statusColor: 'text-green-500' },
];

const mockQuotationDetail = {
  company: 'Auto Parts',
  email: 'autoparts.larefa.com',
  phone: '1 888 235 8926',
  address: 'Av. Insurgentes Sur 1234',
  date: '05 Julio 2025',
  qid: '00 11 22',
  validUntil: '20 Julio 2025',
  customer: {
    name: 'Liam Smith',
    phone: '123 456 789',
    address: 'Casa 7/A, Calle 15 (Ubicación de Entrega)'
  },
  items: [
    { name: 'Pastillas de Freno', qty: 10, price: 405 },
    { name: 'Zapatas de Freno', qty: 10, price: 200 }
  ],
  subtotal: 605,
  discount: 0,
  creditFee: 0,
  delivery: 100,
  total: 705,
  paymentTerms: 'Pagar Primero',
  paymentMethod: 'Transferencia Bancaria\nBanca en Línea',
  deliveryMethod: 'Uber'
};

export const QuotationPage = () => {
  const [activeTab, setActiveTab] = useState('quotation');
  const [selectedQuotation, setSelectedQuotation] = useState<typeof mockQuotations[0] | null>(null);
  const [customer, setCustomer] = useState({
    name: 'Liam Smith',
    address: 'Casa 7/A, Calle 15',
    mobile: '123 456 789'
  });
  const [items, setItems] = useState([
    { id: 1, name: 'Pastillas de Freno', qty: 10, price: 20.00 },
    { id: 2, name: 'Pastillas de Freno', qty: 10, price: 20.00 }
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      name: '',
      qty: 1,
      price: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: number, field: string, value: string | number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.qty * item.price), 0);

  const QuotationForm = () => (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Customer Details */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Detalles del Cliente</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Nombre</label>
              <input
                type="text"
                value={customer.name}
                onChange={(e) => setCustomer({...customer, name: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Dirección</label>
              <input
                type="text"
                value={customer.address}
                onChange={(e) => setCustomer({...customer, address: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Teléfono Móvil</label>
              <input
                type="text"
                value={customer.mobile}
                onChange={(e) => setCustomer({...customer, mobile: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                defaultValue={mockQuotationDetail.company}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input
                type="email"
                defaultValue={mockQuotationDetail.email}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Teléfono</label>
              <input
                type="text"
                defaultValue={mockQuotationDetail.phone}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Dirección</label>
              <input
                type="text"
                defaultValue={mockQuotationDetail.address}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-500 focus:border-red-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Artículos</h3>
        <div className="space-y-3">
          {/* Header */}
          <div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-600">
            <div className="col-span-6">Nombre del Artículo</div>
            <div className="col-span-2 text-center">Cantidad</div>
            <div className="col-span-3 text-right">Precio Unitario</div>
            <div className="col-span-1"></div>
          </div>
          
          {items.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-6">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50 focus:outline-none focus:ring-1 focus:ring-red-500"
                  placeholder="Nombre del artículo"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  value={item.qty}
                  onChange={(e) => updateItem(item.id, 'qty', parseInt(e.target.value) || 0)}
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-center focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>
              <div className="col-span-3">
                <input
                  type="number"
                  value={item.price}
                  onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-right focus:outline-none focus:ring-1 focus:ring-red-500"
                  step="0.01"
                />
              </div>
              <div className="col-span-1">
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
          
          {/* Add Product Buttons */}
          {[...Array(8 - items.length)].map((_, index) => (
            <button
              key={index}
              onClick={addItem}
              className="w-full p-3 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-red-500 hover:text-red-500 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              Agregar Producto
            </button>
          ))}
        </div>
      </div>

      {/* Subtotal and Create Button */}
      <div className="mt-8 flex justify-between items-center">
        <div></div>
        <div className="text-right">
          <div className="text-lg font-semibold mb-4">
            Sub Total: ${subtotal.toFixed(2)}
          </div>
          <button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-medium transition-colors">
            Crear Cotización
          </button>
        </div>
      </div>
    </div>
  );

  const HistoryView = () => (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div></div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 w-64"
            />
          </div>
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <div className="grid grid-cols-2 gap-1">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-1 h-1 bg-gray-400 rounded-full"></div>
              ))}
            </div>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {mockQuotations.map((quotation, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
               onClick={() => setSelectedQuotation(quotation)}>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{quotation.id}</div>
                  <div className="text-sm text-gray-500">{quotation.customer}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${quotation.statusColor}`}>
                  {quotation.status}
                </span>
                <div className="flex gap-1">
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Printer size={16} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Share size={16} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Edit size={16} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Repeat size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

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
                activeTab === 'quotation'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Nueva Cotización
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Historial
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-6">
        {activeTab === 'quotation' ? <QuotationForm /> : <HistoryView />}
      </div>
    </div>
  );
};