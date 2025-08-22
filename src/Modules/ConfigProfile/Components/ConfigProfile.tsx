"use client"
import { Plus, Globe, Phone, Copy, MoreVertical } from "lucide-react"
import {useRegistrationFlow} from "@/hooks/Auth/useRegistrationFlow";

export const ConfigProfile = () => {
    const {handleStoreSetup , storeData} = useRegistrationFlow();

    const items = [
        { label: "Store Total Products", icon: "🧾", value: 0 },
        { label: "Available Products", icon: "🏷️", value: 0 },
        { label: "Unavailable Products", icon: "📦", value: 0 },
        { label: "Total Product Sold", icon: "📈", value: 0 }
    ]

    return (
        <div  className="flex justify-center items-center h-screen w-screen">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-4 space-y-4">
                <div className="relative">
                    <img
                        src="/images/Back.png"
                        alt="Banner"
                        className="w-full h-40 object-cover rounded-t-xl"
                    />
                    <div className="absolute -bottom-6 left-4">
                        <img
                            src="https://api.dicebear.com/9.x/avataaars-neutral/svg?seed=Aidan"
                            alt="Logo"
                            className="w-16 h-16 rounded-full border-4 border-white"
                        />
                    </div>
                </div>

                {/* Store Info */}
                <div className="pt-8 px-4 flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            Auto Parts
                            <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded-full">Free</span>
                        </h2>
                        <div className="flex items-center gap-2 text-gray-600 mt-1">
                            <Globe className="w-4 h-4" />
                            <span>autoparts.larefa.com</span>
                            <Copy className="w-4 h-4 cursor-pointer" />
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 mt-1">
                            <Phone className="w-4 h-4" />
                            <span>1 888 235 9826</span>
                        </div>
                    </div>
                    <MoreVertical className="w-5 h-5 text-gray-500 cursor-pointer" />
                </div>

                {/* Quick Overview */}
                <div className="px-4">
                    <h3 className="text-sm font-medium mb-3">Quick Overview</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {items.map((item, idx) => (
                            <div key={idx} className="bg-gray-50 rounded-lg p-3 shadow-sm relative">
                                <div className="text-2xl">{item.icon}</div>
                                <div className="text-xs text-gray-500 mt-2">{item.label}</div>
                                <div className="text-lg font-bold mt-1">{item.value}</div>
                                <MoreVertical className="absolute top-2 right-2 w-4 h-4 text-gray-400" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Category */}
                <div className="px-4">
                    <h3 className="text-sm font-medium mb-3">My Category</h3>
                    <div className="flex items-center gap-2">
                        <button className="flex flex-col items-center justify-center bg-red-600 text-white w-20 h-20 rounded-lg hover:bg-red-700">
                            <Plus className="w-6 h-6" />
                            <span className="text-xs mt-1">Add<br />Category</span>
                        </button>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-between px-4 pb-2 pt-4 gap-4">
                    <button className="flex-1 border border-red-500 text-red-600 py-3 rounded-lg hover:bg-red-50">
                        Make Changes
                    </button>
                    <button className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700"
                            onClick={async ()=>{
                                // Validar que storeData tenga todos los campos requeridos
                                if (storeData.storeName && storeData.storeUrl && storeData.phone && 
                                    storeData.businessEmail && storeData.storeType && storeData.physicalAddress && 
                                    storeData.rfcType && storeData.rfcNumber) {
                                    await handleStoreSetup(storeData as {
                                        storeName: string;
                                        storeUrl: string;
                                        phone: string;
                                        businessEmail: string;
                                        whatsappUrl: string;
                                        storeType: 'physical' | 'local';
                                        physicalAddress: string;
                                        rfcType: 'refa' | 'own';
                                        rfcNumber: string;
                                        logo?: File | string;
                                        banner?: File | string;
                                    })
                                } else {
                                    alert('Por favor completa todos los campos requeridos antes de finalizar la configuración')
                                }
                            }}
                    >
                        Finish Setup
                    </button>
                </div>
            </div>
        </div>

    )
}
