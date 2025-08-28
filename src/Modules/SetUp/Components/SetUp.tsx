"use client"
import { useState } from "react"
import { useRegistrationFlow } from "@/hooks/Auth/useRegistrationFlow";
import { useCities } from "@/hooks/Cities";
import supabase from "@/lib/Supabase";
import { StoreData } from "@/types/auth";
import Image from "next/image";
import { Upload, Store, Phone, Mail, MapPin, FileText, Globe, MessageCircle } from "lucide-react";

// Subcomponentes movidos fuera para evitar recreación en cada render

interface FormData {
    storeName: string;
    storeUrl: string;
    phone: string;
    corporateEmail: string;
    whatsappUrl: string;
    storeType: string;
    street: string;
    cityId: string;
    zone: string;
    rfcType: string;
    logo: string;
    banner: string;
    rfcNumber: string;
    status: boolean;
}

const UploadArea = ({ 
    type, 
    formData, 
    uploadingFiles, 
    handleFileSelect 
}: { 
    type: 'logo' | 'banner'
    formData: FormData
    uploadingFiles: Record<string, boolean>
    handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => Promise<void>
}) => (
    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-red-400 transition-all duration-300 hover:shadow-md bg-gray-50 hover:bg-gray-100">
        <input
            type="file"
            id={`${type}-upload`}
            accept="image/*"
            onChange={(e) => handleFileSelect(e, type)}
            className="hidden"
        />
        <label htmlFor={`${type}-upload`} className="cursor-pointer block">
            <div className="space-y-3">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border-2 border-gray-200">
                    {formData[type] ? (
                        <Image src={formData[type]} alt={type} width={64} height={64} className="w-16 h-16 rounded-full object-cover" />
                    ) : (
                        <Upload className="w-8 h-8 text-gray-400" />
                    )}
                </div>
                <div>
                    <p className="font-semibold text-gray-700 text-sm">
                        {type === 'logo' ? 'Logo de la tienda' : 'Banner de la tienda'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        {uploadingFiles[type] ? 'Subiendo...' : 'Haz clic para subir'}
                    </p>
                </div>
            </div>
        </label>
    </div>
)

const FormSection = ({
    label,
    children,
    icon: Icon
}: {
    label: string
    children: React.ReactNode
    icon?: React.ComponentType<{ className?: string }>
}) => (
    <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            {Icon && <Icon className="w-4 h-4 text-red-500" />}
            {label}
        </label>
        {children}
    </div>
)

const InputField = ({
    placeholder,
    value,
    onChange,
    type = "text",
    disabled = false,
    icon: Icon
}: {
    placeholder: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    type?: string
    disabled?: boolean
    icon?: React.ComponentType<{ className?: string }>
}) => (
    <div className="relative">
        {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon className="h-5 w-5 text-gray-400" />
            </div>
        )}
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                Icon ? 'pl-10' : ''
            } ${
                disabled 
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                    : 'bg-white hover:border-gray-400 focus:border-red-500'
            }`}
        />
    </div>
)

const SelectField = ({
    value,
    onChange,
    options,
    placeholder
}: {
    value: string
    onChange: (value: string) => void
    options: { value: string; label: string }[]
    placeholder: string
}) => (
    <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-white hover:border-gray-400"
    >
        <option value="" disabled>{placeholder}</option>
        {options.map((option) => (
            <option key={option.value} value={option.value}>
                {option.label}
            </option>
        ))}
    </select>
)

const SetUp = () => {
    const [storeType, setStoreType] = useState("Local")
    const [rfcType] = useState("own")
    const [uploadingFiles, setUploadingFiles] = useState({ logo: false, banner: false })
    const { handleStoreSetup } = useRegistrationFlow();
    const { loading: citiesLoading, getCityOptions } = useCities();

    const [formData, setFormData] = useState({
        storeName: '',
        storeUrl: '',
        phone: '',
        corporateEmail: '', // Solo email corporativo
        whatsappUrl: '',
        storeType: "",
        // Campos de dirección
        street: '',
        cityId: '',
        zone: '',
        rfcType: "",
        logo: "",
        banner: "",
        rfcNumber: "",
        status: false
    })

    const uploadFile = async (file: File, type: 'logo' | 'banner') => {
        try {
            setUploadingFiles(prev => ({ ...prev, [type]: true }))
            const fileExt = file.name.split('.').pop()
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
            const filePath = `stores/${type}s/${fileName}`

            const { error } = await supabase.storage
                .from('store-assets')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (error) throw error

            const { data: publicUrlData } = supabase.storage.from('store-assets').getPublicUrl(filePath)

            // Actualizar el form data con la URL
            setFormData({...formData, [type]: publicUrlData.publicUrl})
            return publicUrlData.publicUrl
        } catch (error: unknown) {
            console.error(`Error uploading ${type}:`, error)
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            alert(`Error al subir ${type}: ${errorMessage}`)
        } finally {
            setUploadingFiles(prev => ({ ...prev, [type]: false }))
        }
    }

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
        const file = event.target.files?.[0]
        if (!file) return

        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if (!validTypes.includes(file.type)) {
            alert('Por favor selecciona una imagen válida (JPEG, PNG, WebP)')
            return
        }

        const maxSize = 5 * 1024 * 1024
        if (file.size > maxSize) {
            alert('El archivo es demasiado grande. Máximo 5MB')
            return
        }

        await uploadFile(file, type)
    }

    const handleSendSetUpStore = async () => {
        // Validaciones básicas
        if (!formData.storeName || !formData.phone || !formData.corporateEmail || !formData.street || !formData.cityId) {
            alert('Por favor, completa todos los campos obligatorios (Nombre, Teléfono, Dirección, Ciudad, Email corporativo)');
            return;
        }

        try {
            // 1. Buscar la persona por email para obtener el lord_id
            const { data: personData, error: personError } = await supabase
                .from('person')
                .select('id')
                .eq('email', formData.corporateEmail)
                .single();

            if (personError || !personData) {
                throw new Error('No se encontró la persona registrada. Verifica el email corporativo.');
            }

            // 2. Crear la dirección
            const { data: addressData, error: addressError } = await supabase
                .from('adress')
                .insert({
                    street: formData.street,
                    city_id: parseInt(formData.cityId),
                    zone: formData.zone
                })
                .select();

            if (addressError) throw addressError;

            // 3. Crear el perfil de la tienda
            const { data: profileData, error: profileError } = await supabase
                .from('store_profile')
                .insert({
                    name: formData.storeName,
                    description: formData.storeName,
                    phone: formData.phone,
                    banner_image: formData.banner,
                    logo_image: formData.logo,
                    whatsapp_url: formData.whatsappUrl,
                    type_store: storeType === "Local" ? 1 : 2,
                    address: addressData?.[0]?.id,
                    corporate_email: formData.corporateEmail,
                    rfc: formData.rfcNumber
                })
                .select();

            if (profileError) throw profileError;

            // 4. Crear la tienda vinculando persona y perfil
            const { data: storeData, error: storeError } = await supabase
                .from('store')
                .insert({
                    lord_id: personData.id,
                    profile_id: profileData?.[0]?.id
                })
                .select();

            if (storeError) throw storeError;
            
            alert('Configuración de la tienda completada exitosamente!');
            
            // Aquí podrías redirigir al usuario o actualizar el estado
            if (handleStoreSetup) {
                await handleStoreSetup(formData as StoreData);
            }
        } catch (error: unknown) {
            console.error('Error setting up store:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            alert(`Error al configurar la tienda: ${errorMessage}`);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center py-8 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="w-full max-w-4xl p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
                <header className="text-center mb-10">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Store className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">Configura tu tienda</h2>
                    <p className="text-gray-600 text-lg mb-4">Crea tu tienda de autopartes en línea en minutos.</p>
                    <p className="text-gray-500">Personaliza tu marca y comienza a vender sin inventario.</p>
                </header>

                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                    <UploadArea type="logo" formData={formData} uploadingFiles={uploadingFiles} handleFileSelect={handleFileSelect} />
                    <UploadArea type="banner" formData={formData} uploadingFiles={uploadingFiles} handleFileSelect={handleFileSelect} />
                </section>

                <section className="space-y-6 mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <FormSection label="Nombre de tu tienda" icon={Store}>
                            <InputField
                                placeholder="Ej: AutoPartes Express"
                                value={formData.storeName}
                                onChange={(e) => setFormData({...formData, storeName: e.target.value})}
                                icon={Store}
                            />
                        </FormSection>
                        
                        <FormSection label="URL de la tienda" icon={Globe}>
                            <InputField
                                placeholder="Se genera automáticamente"
                                disabled={true}
                                value={formData.storeUrl}
                                onChange={(e) => setFormData({...formData, storeUrl: e.target.value})}
                                icon={Globe}
                            />
                        </FormSection>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <FormSection label="Número de teléfono" icon={Phone}>
                            <InputField
                                type="tel"
                                placeholder="+57 300 123 4567"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                icon={Phone}
                            />
                        </FormSection>
                        
                        <FormSection label="Email corporativo de la tienda" icon={Mail}>
                            <InputField
                                type="email"
                                placeholder="tienda@tutienda.com"
                                value={formData.corporateEmail}
                                onChange={(e) => setFormData({...formData, corporateEmail: e.target.value})}
                                icon={Mail}
                            />
                        </FormSection>
                    </div>

                    <FormSection label="URL de WhatsApp" icon={MessageCircle}>
                        <InputField
                            placeholder="https://wa.me/573001234567"
                            value={formData.whatsappUrl}
                            onChange={(e) => setFormData({...formData, whatsappUrl: e.target.value})}
                            icon={MessageCircle}
                        />
                    </FormSection>
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <FormSection label="Tipo de tienda" icon={Store}>
                        <SelectField
                            value={storeType}
                            onChange={(value) => {
                                setStoreType(value)
                                setFormData({...formData, storeType: value})
                            }}
                            options={[
                                { value: "Local", label: "Local" },
                                { value: "Nacional", label: "Nacional" }
                            ]}
                            placeholder="Selecciona el tipo de tienda"
                        />
                    </FormSection>
                </section>

                <section className="space-y-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Dirección de la tienda</h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <FormSection label="Calle y número" icon={MapPin}>
                            <InputField
                                placeholder="Ej: Calle 123 #45-67"
                                value={formData.street}
                                onChange={(e) => setFormData({...formData, street: e.target.value})}
                                icon={MapPin}
                            />
                        </FormSection>
                        
                        <FormSection label="Ciudad" icon={MapPin}>
                            {citiesLoading ? (
                                <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500">
                                    Cargando ciudades...
                                </div>
                            ) : (
                                <SelectField
                                    value={formData.cityId}
                                    onChange={(value) => setFormData({...formData, cityId: value})}
                                    options={getCityOptions()}
                                    placeholder="Selecciona una ciudad"
                                />
                            )}
                        </FormSection>
                    </div>

                    <FormSection label="Zona/Barrio" icon={MapPin}>
                        <InputField
                            placeholder="Ej: Chapinero, Centro, etc."
                            value={formData.zone}
                            onChange={(e) => setFormData({...formData, zone: e.target.value})}
                            icon={MapPin}
                        />
                    </FormSection>
                </section>

                {rfcType === "own" && (
                    <section className="mb-8">
                        <FormSection label="Número de RFC" icon={FileText}>
                            <InputField
                                placeholder="Ej: ABC123456789"
                                value={formData.rfcNumber}
                                onChange={(e) => setFormData({...formData, rfcNumber: e.target.value})}
                                icon={FileText}
                            />
                        </FormSection>
                    </section>
                )}

                <footer className="pt-6 border-t border-gray-200">
                    <button
                        onClick={handleSendSetUpStore}
                        disabled={uploadingFiles.logo || uploadingFiles.banner}
                        className={`w-full font-semibold py-4 rounded-xl transition-all duration-200 text-lg ${
                            uploadingFiles.logo || uploadingFiles.banner
                                ? 'bg-gray-400 cursor-not-allowed text-white'
                                : 'bg-red-600 hover:bg-red-700 text-white hover:shadow-lg transform hover:-translate-y-0.5'
                        }`}
                    >
                        {uploadingFiles.logo || uploadingFiles.banner ? 'Subiendo archivos...' : 'Ir a vista previa'}
                    </button>
                </footer>
            </div>
        </div>
    )
}

export default SetUp