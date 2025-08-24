"use client";

import React from "react";
import { DashboardInformation } from "@/app/(dashboard)/_components/DashboardInformation";
import { NewArrivals } from "@/app/(dashboard)/_components/NewArrivals";
import { SalesOverview } from "@/app/(dashboard)/_components/SalesOverview";
import { usePerson } from "@/hooks/Person/usePerson";

export const DashboardPage = () => {
    const { person } = usePerson();

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header del Dashboard */}
                <div className="text-center lg:text-left">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Bienvenido al Dashboard {person?.username}
                    </h1>
                    <p className="text-lg text-gray-600">
                        Gestiona tu tienda y monitorea el rendimiento
                    </p>
                </div>

                {/* Información Principal del Dashboard */}
                <DashboardInformation />

                {/* Resumen de Ventas */}
                <SalesOverview />

                {/* Nuevos Lanzamientos */}
                <NewArrivals />

                {/* Información Adicional */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Estadísticas Rápidas */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                            Acciones Rápidas
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
                                <span className="text-blue-700 font-medium">Agregar Producto</span>
                                <span className="text-blue-500">→</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer">
                                <span className="text-green-700 font-medium">Ver Catálogo</span>
                                <span className="text-green-500">→</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer">
                                <span className="text-purple-700 font-medium">Gestionar Pedidos</span>
                                <span className="text-purple-500">→</span>
                            </div>
                        </div>
                    </div>

                    {/* Estado del Sistema */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                            Estado del Sistema
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Base de Datos</span>
                                <span className="flex items-center">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                    <span className="text-green-600 text-sm">Conectado</span>
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">API</span>
                                <span className="flex items-center">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                    <span className="text-green-600 text-sm">Activo</span>
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Almacenamiento</span>
                                <span className="flex items-center">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                    <span className="text-blue-600 text-sm">Disponible</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};