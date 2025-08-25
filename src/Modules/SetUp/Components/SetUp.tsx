"use client"
import { useState } from "react"
import { useRegistrationFlow } from "@/hooks/Auth/useRegistrationFlow";
import supabase from "@/lib/Supabase";
import { StoreData } from "@/types/auth";
import Image from "next/image";

const SetUp = () => {
    const [storeType, setStoreType] = useState("Local")
    const [rfcType, setRfcType] = useState("own")
    const [uploadingFiles, setUploadingFiles] = useState({ logo: false, banner: false })
    const { handleStoreSetup } = useRegistrationFlow();

    const [formData, setFormData] = useState({
        storeName: '',
        storeUrl: '',
        phone: '',
        businessEmail: '',
        whatsappUrl: '',
        storeType: "",
        physicalAddress: '',
        rfcType: "",
        logo: "",
        banner: "",
        rfcNumber: ""
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

            console.log(`${type} uploaded successfully:`, publicUrlData.publicUrl)
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
        try {
            const { data: addressData, error: addressError } = await supabase.from('Address').insert({
                street: formData.physicalAddress,
                city_id: 1,
                zone: "Centro"
            }).select()

            if (addressError) throw addressError

            const { data, error } = await supabase.from('Profile_Store').insert({
                name: formData.storeName,
                description: formData.storeName,
                phone: formData.phone,
                banner_image: formData.banner,
                email: formData.businessEmail,
                logo_image: formData.logo,
                url: formData.storeUrl,
                business_email: formData.businessEmail,
                whatsapp_url: formData.whatsappUrl,
                type_store: storeType === "Local" ? 1 : 2,
                address: addressData?.[0]?.id,
                rfc: formData.rfcNumber
            }).select()

            if (error) throw error

            console.log('Store setup completed successfully:', data)
            alert('Configuración de la tienda completada exitosamente!')
            
            // Aquí podrías redirigir al usuario o actualizar el estado
            if (handleStoreSetup) {
                await handleStoreSetup(formData as StoreData)
            }
        } catch (error: unknown) {
            console.error('Error setting up store:', error)
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            alert(`Error al configurar la tienda: ${errorMessage}`)
        }
    }

    const UploadArea = ({ type }: { type: 'logo' | 'banner' }) => (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-400 transition-colors">
            <input
                type="file"
                id={`${type}-upload`}
                accept="image/*"
                onChange={(e) => handleFileSelect(e, type)}
                className="hidden"
            />
            <label htmlFor={`${type}-upload`} className="cursor-pointer">
                <div className="space-y-2">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                        {formData[type] ? (
                            <Image src={formData[type]} alt={type} width={48} height={48} className="w-12 h-12 rounded-full object-cover" />
                        ) : (
                            <span className="text-2xl">📁</span>
                        )}
                    </div>
                    <div>
                        <p className="font-medium text-gray-700">
                            {type === 'logo' ? 'Logo de la tienda' : 'Banner de la tienda'}
                        </p>
                        <p className="text-sm text-gray-500">
                            {uploadingFiles[type] ? 'Subiendo...' : 'Haz clic para subir'}
                        </p>
                    </div>
                </div>
            </label>
        </div>
    )



    const FormSection = ({
        label,
        children
    }: {
        label: string
        children: React.ReactNode
    }) => (
        <div>
            <label className="block mb-3 font-medium text-gray-700">{label}</label>
            {children}
        </div>
    )

    return (
        <div className="min-h-screen flex items-center justify-center py-8 px-4">
            <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-lg">
                <header className="text-center mb-8">
                    <h2 className="text-2xl font-bold mb-2">Configura tu tienda</h2>
                    <p className="text-gray-500 mb-6">Crea tu tienda de autopartes en línea en minutos.</p>
                    <h3 className="font-medium text-gray-800">Personaliza tu marca y comienza a vender sin inventario.</h3>
                </header>

                <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    <UploadArea type="logo" />
                    <UploadArea type="banner" />
                </section>

                <section className="space-y-4 mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                            placeholder="Nombre de tu tienda"
                            value={formData.storeName}
                            onChange={(e) => setFormData({...formData, storeName: e.target.value})}
                        />
                        <input
                            placeholder="*se genera automáticamente basado en el nombre"
                            disabled={true}
                            value={formData.storeUrl}
                            onChange={(e) => setFormData({...formData, storeUrl: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                            type="tel"
                            placeholder="Número de teléfono"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                        <input
                            type="email"
                            placeholder="Email empresarial"
                            value={formData.businessEmail}
                            onChange={(e) => setFormData({...formData, businessEmail: e.target.value})}
                        />
                    </div>

                    <input
                        placeholder="URL de WhatsApp"
                        value={formData.whatsappUrl}
                        onChange={(e) => setFormData({...formData, whatsappUrl: e.target.value})}
                    />
                </section>

                <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <FormSection label="Tipo de tienda">
                        <input
                            placeholder="Local o Nacional"
                            value={storeType}
                            onChange={(e) => {
                                setStoreType(e.target.value)
                                setFormData({...formData, storeType: e.target.value})
                            }}
                        />
                    </FormSection>
                </section>

                <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <FormSection label="Dirección física de la tienda">
                        <input
                            placeholder="Ej: Calle 123 #45-67, Bogotá, Colombia"
                            value={formData.physicalAddress}
                            onChange={(e) => setFormData({...formData, physicalAddress: e.target.value})}
                        />
                    </FormSection>
                </section>

                {rfcType === "own" && (
                    <section className="mb-6">
                        <FormSection label="Número de RFC">
                            <input
                                placeholder="Ej: ABC123456789"
                                value={formData.rfcNumber}
                                onChange={(e) => setFormData({...formData, rfcNumber: e.target.value})}
                            />
                        </FormSection>
                    </section>
                )}

                <footer>
                    <button
                        onClick={handleSendSetUpStore}
                        disabled={uploadingFiles.logo || uploadingFiles.banner}
                        className={`w-full font-semibold py-4 rounded-lg transition-colors ${
                            uploadingFiles.logo || uploadingFiles.banner
                                ? 'bg-gray-400 cursor-not-allowed text-white'
                                : 'bg-red-600 hover:bg-red-700 text-white'
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