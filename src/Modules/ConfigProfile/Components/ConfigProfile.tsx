"use client"
import { Plus, Globe, Phone, Copy, Mail, MapPin, Store, MessageCircle, Edit3 } from "lucide-react"
import { useRegistrationFlow } from "@/hooks/Auth/useRegistrationFlow";
import Image from "next/image";

export const ConfigProfile = () => {
    const { handleFinishSetup, storeData, planData, setCurrentStep } = useRegistrationFlow();

    // Datos de la tienda desde el contexto
    const storeName = storeData?.storeName || 'Mi Tienda';
    const storeUrl = storeData?.storeUrl || 'tienda.larefa.com';
    const phone = storeData?.phone || 'Sin teléfono';
    const corporateEmail = storeData?.corporateEmail || 'Sin email';
    const whatsappUrl = storeData?.whatsappUrl || '';
    const street = storeData?.street || 'Sin dirección';
    const cityId = storeData?.cityId || '';
    const zone = storeData?.zone || '';
    const rfcNumber = storeData?.rfcNumber || 'Sin RFC';
    const logo = storeData?.logo || '';
    const banner = storeData?.banner || '';

    // Datos del plan
    const planType = planData?.planType || 'free';
    const planPrice = planData?.price || 0;
    const planFeatures = planData?.features || [];

    // Función para volver al SetUp para editar
    const handleEditSetup = () => {
        setCurrentStep('store-setup');
    };

    // Función para copiar URL al portapapeles
    const handleCopyUrl = async () => {
        try {
            await navigator.clipboard.writeText(storeUrl);
            // Aquí podrías mostrar un toast de confirmación
        } catch (err) {
            console.error('Error al copiar URL:', err);
        }
    };

    // Función para abrir WhatsApp
    const handleOpenWhatsApp = () => {
        if (whatsappUrl) {
            window.open(whatsappUrl, '_blank');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header con título */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Preview de tu Tienda</h1>
                    <p className="text-gray-600">Revisa cómo se verá tu tienda antes de finalizar la configuración</p>
                </div>

                {/* Preview de la tienda */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Banner y Logo */}
                    <div className="relative">
                        {banner && typeof banner === 'string' ? (
                            <Image
                                src={banner}
                                alt="Banner de la tienda"
                                width={800}
                                height={200}
                                className="w-full h-48 object-cover"
                            />
                        ) : (
                            <div className="w-full h-48 bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center">
                                <Store className="w-16 h-16 text-white opacity-50" />
                            </div>
                        )}
                        
                        {/* Logo superpuesto */}
                        <div className="absolute -bottom-8 left-6">
                            {logo && typeof logo === 'string' ? (
                                <Image
                                    src={logo}
                                    alt="Logo de la tienda"
                                    width={80}
                                    height={80}
                                    className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
                                />
                            ) : (
                                <div className="w-20 h-20 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                                    <Store className="w-10 h-10 text-red-500" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Información de la tienda */}
                    <div className="pt-10 px-6 pb-6">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                                    {storeName}
                                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                                        planType === 'free' 
                                            ? 'bg-green-100 text-green-700' 
                                            : 'bg-blue-100 text-blue-700'
                                    }`}>
                                        {planType === 'free' ? 'Plan Gratis' : `Plan Pro - $${planPrice}/mes`}
                                    </span>
                                </h2>
                                
                                {/* URL de la tienda */}
                                <div className="flex items-center gap-2 text-gray-600 mb-3">
                                    <Globe className="w-4 h-4" />
                                    <span className="font-mono">{storeUrl}</span>
                                    <button 
                                        onClick={handleCopyUrl}
                                        className="text-blue-600 hover:text-blue-700 transition-colors"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Información de contacto */}
                                <div className="space-y-2">
                                    {phone && (
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Phone className="w-4 h-4" />
                                            <span>{phone}</span>
                                        </div>
                                    )}
                                    
                                    {corporateEmail && (
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Mail className="w-4 h-4" />
                                            <span>{corporateEmail}</span>
                                        </div>
                                    )}

                                    {whatsappUrl && (
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <MessageCircle className="w-4 h-4" />
                                            <button 
                                                onClick={handleOpenWhatsApp}
                                                className="text-green-600 hover:text-green-700 underline"
                                            >
                                                Contactar por WhatsApp
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Información de dirección */}
                                {(street || cityId || zone) && (
                                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                        <div className="flex items-start gap-2">
                                            <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                            <div className="text-sm text-gray-600">
                                                <p className="font-medium text-gray-700 mb-1">Dirección de la tienda:</p>
                                                {street && <p>{street}</p>}
                                                {cityId && <p>Ciudad ID: {cityId}</p>}
                                                {zone && <p>Zona: {zone}</p>}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Información del RFC */}
                                {rfcNumber && rfcNumber !== 'Sin RFC' && (
                                    <div className="mt-3 text-sm text-gray-600">
                                        <span className="font-medium">RFC:</span> {rfcNumber}
                                    </div>
                                )}
                            </div>

                            {/* Botón de editar */}
                            <button
                                onClick={handleEditSetup}
                                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <Edit3 className="w-4 h-4" />
                                Editar
                            </button>
                        </div>

                        {/* Características del plan */}
                        {planFeatures.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Características del Plan</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {planFeatures.map((feature, index) => (
                                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            {feature}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Estadísticas simuladas */}
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Vista Rápida</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="bg-gray-50 rounded-lg p-4 text-center">
                                    <div className="text-2xl mb-2">🧾</div>
                                    <div className="text-xs text-gray-500 mb-1">Total de Productos</div>
                                    <div className="text-lg font-bold text-gray-900">0</div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4 text-center">
                                    <div className="text-2xl mb-2">🏷️</div>
                                    <div className="text-xs text-gray-500 mb-1">Disponibles</div>
                                    <div className="text-lg font-bold text-gray-900">0</div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4 text-center">
                                    <div className="text-2xl mb-2">📦</div>
                                    <div className="text-xs text-gray-500 mb-1">No Disponibles</div>
                                    <div className="text-lg font-bold text-gray-900">0</div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4 text-center">
                                    <div className="text-2xl mb-2">📈</div>
                                    <div className="text-xs text-gray-500 mb-1">Vendidos</div>
                                    <div className="text-lg font-bold text-gray-900">0</div>
                                </div>
                            </div>
                        </div>

                        {/* Categorías */}
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Categorías de Productos</h3>
                            <div className="flex items-center gap-3">
                                <button className="flex flex-col items-center justify-center bg-red-600 text-white w-20 h-20 rounded-lg hover:bg-red-700 transition-colors">
                                    <Plus className="w-6 h-6" />
                                    <span className="text-xs mt-1 text-center">Agregar<br />Categoría</span>
                                </button>
                                <div className="text-sm text-gray-500">
                                    Las categorías se configurarán después de activar tu cuenta
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="mt-8 flex justify-between gap-4">
                    <button 
                        onClick={handleEditSetup}
                        className="flex-1 border border-red-500 text-red-600 py-4 px-6 rounded-xl font-medium hover:bg-red-50 transition-colors"
                    >
                        Hacer Cambios
                    </button>
                    
                    <button 
                        onClick={async () => {
                            try {
                                await handleFinishSetup();
                            } catch (error) {
                                console.error('Error al finalizar configuración:', error);
                            }
                        }}
                        className="flex-1 bg-red-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-red-700 transition-colors transform hover:scale-105 hover:shadow-lg"
                    >
                        Finalizar Configuración
                    </button>
                </div>

                {/* Información adicional */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">
                        Una vez que finalices la configuración, tu cuenta estará pendiente de activación por parte de la administración de Connect.
                    </p>
                </div>
            </div>
        </div>
    );
};
