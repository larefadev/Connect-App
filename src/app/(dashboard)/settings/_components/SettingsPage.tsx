"use client";
import { useStoreProfile } from "@/hooks/StoreProfile/useStoreProfile";
import { useState, useEffect, useRef } from "react";
import { StoreProfile } from "@/types/store";
import { UpdateSettingForm } from "./UpdateSettingForm";
import { RefreshCw } from "lucide-react";

export const SettingsPage = () => {
    const { 
        storeProfile, 
        loading, 
        error, 
        updating, 
        uploadingImage, 
        updateStoreProfile, 
        uploadStoreImage 
    } = useStoreProfile();
    
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<StoreProfile>>({});
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [imageMessage, setImageMessage] = useState<string | null>(null);
    
    const logoInputRef = useRef<HTMLInputElement>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (storeProfile) {
            setFormData({
                name: storeProfile.name.toLowerCase() || '',
                description: storeProfile.description || '',
                phone: storeProfile.phone || '',
                web_url: storeProfile.web_url || '',
                whatsapp_url: storeProfile.whatsapp_url || ''
            });
        }
    }, [storeProfile]);

    const handleInputChange = (field: keyof StoreProfile, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        try {
            const result = await updateStoreProfile(formData);
            if (result?.success) {
                setSuccessMessage('Perfil de tienda actualizado exitosamente');
                setIsEditing(false);
                setTimeout(() => setSuccessMessage(null), 3000);
            }
        } catch (err) {
            console.error('Error al guardar:', err);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        if (storeProfile) {
            setFormData({
                name: storeProfile.name?.toLowerCase() || '',
                description: storeProfile.description || '',
                phone: storeProfile.phone || '',
                web_url: storeProfile.web_url || '',
                whatsapp_url: storeProfile.whatsapp_url || ''
            });
        }
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, imageType: 'logo' | 'banner') => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
            setImageMessage('Por favor selecciona un archivo de imagen válido');
            setTimeout(() => setImageMessage(null), 3000);
            return;
        }

        // Validar tamaño del archivo (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setImageMessage('La imagen debe ser menor a 5MB');
            setTimeout(() => setImageMessage(null), 3000);
            return;
        }

        try {
            const result = await uploadStoreImage(file, imageType);
            if (result?.success) {
                setImageMessage(`${imageType === 'logo' ? 'Logo' : 'Banner'} actualizado exitosamente`);
                setTimeout(() => setImageMessage(null), 3000);
            } else {
                setImageMessage(result?.error ? String(result.error) : `Error al subir ${imageType}`);
                setTimeout(() => setImageMessage(null), 3000);
            }
        } catch (err) {
            console.error(`Error al subir ${imageType}:`, err);
            setImageMessage(`Error al subir ${imageType}`);
            setTimeout(() => setImageMessage(null), 3000);
        }

        // Limpiar el input
        if (imageType === 'logo' && logoInputRef.current) {
            logoInputRef.current.value = '';
        } else if (imageType === 'banner' && bannerInputRef.current) {
            bannerInputRef.current.value = '';
        }
    };

    const triggerFileInput = (imageType: 'logo' | 'banner') => {
        if (imageType === 'logo') {
            logoInputRef.current?.click();
        } else {
            bannerInputRef.current?.click();
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-center items-center py-12">
                    <div className="text-center">
                        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-500" />
                        <p className="text-gray-600">Cargando...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg text-red-500">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    {successMessage}
                </div>
            )}

            {imageMessage && (
                <div className={`px-4 py-3 rounded ${
                    imageMessage.includes('exitosamente') 
                        ? 'bg-green-100 border border-green-400 text-green-700' 
                        : 'bg-red-100 border border-red-400 text-red-700'
                }`}>
                    {imageMessage}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <UpdateSettingForm
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    handleCancel={handleCancel}
                    handleSave={handleSave}
                    updating={updating}
                    logoInputRef={logoInputRef as React.RefObject<HTMLInputElement>}
                    formData={formData as StoreProfile}
                    storeProfile={storeProfile as StoreProfile}
                    uploadingImage={uploadingImage}
                    handleImageUpload={handleImageUpload}
                    triggerFileInput={triggerFileInput}
                    handleInputChange={handleInputChange}
                    bannerInputRef={bannerInputRef as React.RefObject<HTMLInputElement>}
                />
            </div>
        </div>
    );
};