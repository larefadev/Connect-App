"use client"
import { useState } from "react"
import { useRegistrationFlow } from "@/hooks/Auth/useRegistrationFlow";
import supabase from "@/lib/Supabase";

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
        } catch (error: any) {
            console.error(`Error uploading ${type}:`, error)
            alert(`Error al subir ${type}: ${error.message}`)
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
                rfc_type: formData.rfcType,
                rfc_number: formData.rfcNumber
            })

            if (error) throw error

            console.log('Store setup completed:', data)
        } catch (error: any) {
            console.error('Error setting up store:', error)
            alert('Error al configurar la tienda: ' + error.message)
        }
    }

    const UploadArea = ({ type }: { type: "logo" | "banner" }) => {
        const isUploading = uploadingFiles[type]
        const hasFile = formData[type]

        return (
            <div className="relative">
                <input
                    type="file"
                    id={`upload-${type}`}
                    className="hidden"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={(e) => handleFileSelect(e, type)}
                    disabled={isUploading}
                />
                <label
                    htmlFor={`upload-${type}`}
                    className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 text-center min-h-[120px] cursor-pointer transition-colors ${
                        isUploading
                            ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                            : hasFile
                                ? 'border-green-400 bg-green-50 hover:border-green-500'
                                : 'border-gray-300 hover:border-red-400'
                    }`}
                >
                    {isUploading ? (
                        <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mb-2"></div>
                            <p className="text-sm text-gray-500">Subiendo {type}...</p>
                        </div>
                    ) : hasFile ? (
                        <div className="flex flex-col items-center">
                            <div className="text-green-500 mb-2">
                                <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-sm text-green-600 font-medium">
                                {type.charAt(0).toUpperCase() + type.slice(1)} subido exitosamente
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Click para cambiar</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <div className="text-gray-400 mb-2">
                                <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                            </div>
                            <p className="text-sm text-gray-500">
                                Drop your {type} here, or select<br />
                                <span className="text-red-500 font-medium cursor-pointer">Click to browse</span>
                            </p>
                        </div>
                    )}
                </label>

                {hasFile && !isUploading && (
                    <div className="mt-2">
                        <img
                            src={formData[type]}
                            alt={`${type} preview`}
                            className="w-full h-20 object-cover rounded border"
                        />
                    </div>
                )}
            </div>
        )
    }
    
    const ToggleButton = ({
        label,
        isActive,
        onClick
    }: {
        label: string
        isActive: boolean
        onClick: (e: any) => void
    }) => (
        <button
            type="button"
            className={`px-6 py-2 rounded-full border transition-colors ${
                isActive
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
            }`}
            onClick={onClick}
        >
            {label}
        </button>
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