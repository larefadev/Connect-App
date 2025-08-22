'use client';
import React, { useState } from 'react';
import { Store, Plus, X, Search, FileText, Printer, Share, Edit, Repeat } from 'lucide-react';

// Mock data
const mockQuotations = [
  { id: '#123456', customer: 'Liam Smith', status: 'Sent', statusColor: 'text-red-500' },
  { id: '#123458', customer: 'Liam Smith', status: 'Pending', statusColor: 'text-red-500' },
  { id: '#123456', customer: 'Liam Smith', status: 'Accepted', statusColor: 'text-green-500' },
];

const mockQuotationDetail = {
  company: 'Auto Parts',
  email: 'autoparts.larefa.com',
  phone: '1 888 235 8926',
  address: 'Av. Insurgentes Sur 1234',
  date: '05 July 2025',
  qid: '00 11 22',
  validUntil: '20 July 2025',
  customer: {
    name: 'Liam Smith',
    phone: '123 456 789',
    address: 'House 7/A, Road 15 (Delivery Location)'
  },
  items: [
    { name: 'Break Pad', qty: 10, price: 405 },
    { name: 'Break Shoe', qty: 10, price: 200 }
  ],
  subtotal: 605,
  discount: 0,
  creditFee: 0,
  delivery: 100,
  total: 705,
  paymentTerms: 'Pay First',
  paymentMethod: 'Bank Transfer\nOnline Banking',
  deliveryMethod: 'Uber'
};

export const QuotationPage = () => {
  const [activeTab, setActiveTab] = useState('quotation');
  const [selectedQuotation, setSelectedQuotation] = useState<typeof mockQuotations[0] | null>(null);
  const [customer, setCustomer] = useState({
    name: 'Liam Smith',
    address: 'House 7/A, Road 15',
    mobile: '123 456 789'
  });
  const [items, setItems] = useState([
    { id: 1, name: 'Break Pads', qty: 10, price: 20.00 },
    { id: 2, name: 'Break Pads', qty: 10, price: 20.00 }
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
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Customer Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Name</label>
              <input
                type="text"
                value={customer.name}
                onChange={(e) => setCustomer({...customer, name: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Address</label>
              <input
                type="text"
                value={customer.address}
                onChange={(e) => setCustomer({...customer, address: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Mobile</label>
              <input
                type="text"
                value={customer.mobile}
                onChange={(e) => setCustomer({...customer, mobile: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>
        </div>

        {/* Item Details */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Item Details</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-600 pb-2">
              <div className="col-span-6">Items</div>
              <div className="col-span-2 text-center">QTY</div>
              <div className="col-span-3 text-right">Price</div>
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
                    placeholder="Item name"
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
                Add Product
              </button>
            ))}
          </div>
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
            Create a Quotation
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
              placeholder="Search..."
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <FileText className="text-gray-600" size={20} />
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{quotation.customer}</div>
                  <div className="text-sm text-gray-600">QID {quotation.id}</div>
                </div>
              </div>
              <div className={`font-medium ${quotation.statusColor}`}>
                {quotation.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const QuotationDetail = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-900 rounded-lg">
                <Store className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold">{mockQuotationDetail.company}</h1>
                <div className="text-sm text-gray-600">
                  <div>{mockQuotationDetail.email}</div>
                  <div>{mockQuotationDetail.phone}</div>
                  <div>{mockQuotationDetail.address}</div>
                </div>
              </div>
            </div>
            <div className="text-right text-sm">
              <div><span className="font-medium">Date:</span> {mockQuotationDetail.date}</div>
              <div><span className="font-medium">QID:</span> {mockQuotationDetail.qid}</div>
              <div><span className="font-medium">Valid Until:</span> {mockQuotationDetail.validUntil}</div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Customer Details</h3>
            <div className="text-sm text-gray-600">
              <div>{mockQuotationDetail.customer.name}</div>
              <div>{mockQuotationDetail.customer.phone}</div>
              <div>{mockQuotationDetail.customer.address}</div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-6">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Item</th>
                  <th className="text-center py-2">Qty</th>
                  <th className="text-right py-2">Price</th>
                </tr>
              </thead>
              <tbody>
                {mockQuotationDetail.items.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{item.name}</td>
                    <td className="text-center py-2">x{item.qty}</td>
                    <td className="text-right py-2">${item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="border-t border-dashed pt-4 mb-4">
            <div className="flex justify-between py-1">
              <span>Subtotal</span>
              <span>${mockQuotationDetail.subtotal}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Discount</span>
              <span>${mockQuotationDetail.discount}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Credit Fee</span>
              <span>${mockQuotationDetail.creditFee}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Delivery</span>
              <span>${mockQuotationDetail.delivery}</span>
            </div>
          </div>

          <div className="border-t border-dashed pt-4 mb-6">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${mockQuotationDetail.total}</span>
            </div>
          </div>

          {/* Payment Details */}
          <div className="grid grid-cols-3 gap-6 text-sm mb-6">
            <div>
              <div className="font-medium">Payment Terms</div>
              <div className="text-gray-600">{mockQuotationDetail.paymentTerms}</div>
            </div>
            <div>
              <div className="font-medium">Payment Method</div>
              <div className="text-gray-600 whitespace-pre-line">{mockQuotationDetail.paymentMethod}</div>
            </div>
            <div>
              <div className="font-medium">Delivery Method</div>
              <div className="text-gray-600">{mockQuotationDetail.deliveryMethod}</div>
            </div>
          </div>

          {/* Visit Store Button */}
          <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg mb-6">
            Visit Store
          </button>
        </div>
      </div>

      {/* Floating Action Menu */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Edit size={16} />
          Edit Quotation
        </div>
        <button className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2">
          <Repeat size={16} />
          Repeat This Order
        </button>
        <button className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2">
          <Printer size={16} />
          Print
        </button>
        <button className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm">
          Share via WhatsApp
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Tabs */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex space-x-8">
            <button
              onClick={() => {
                setActiveTab('quotation');
                setSelectedQuotation(null);
              }}
              className={`py-4 px-2 border-b-2 font-medium ${
                activeTab === 'quotation' && !selectedQuotation
                  ? 'border-red-500 text-red-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Quotation
            </button>
            <button
              onClick={() => {
                setActiveTab('history');
                setSelectedQuotation(null);
              }}
              className={`py-4 px-2 border-b-2 font-medium ${
                activeTab === 'history' && !selectedQuotation
                  ? 'border-red-500 text-red-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              History
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-6">
        {selectedQuotation ? (
          <QuotationDetail />
        ) : activeTab === 'quotation' ? (
          <QuotationForm />
        ) : (
          <HistoryView />
        )}
      </div>
    </div>
  );
};