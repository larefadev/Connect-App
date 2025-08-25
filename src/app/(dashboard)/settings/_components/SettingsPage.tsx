"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Globe, Package, Settings, History, Camera, Save, Edit, X, Upload, Store } from "lucide-react";
import { useStoreProfile } from "@/hooks/StoreProfile/useStoreProfile";
import { useState, useEffect, useRef } from "react";
import { StoreProfile } from "@/types/store";

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
                name: storeProfile.name || '',
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
                name: storeProfile.name || '',
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
            <div className="flex items-center justify-center h-64">
                <div className="text-lg">Cargando configuración de la tienda...</div>
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
                {/* Configuración de la Tienda */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Store className="w-5 h-5" />
                            Configuración de la Tienda
                        </CardTitle>
                        {!isEditing ? (
                            <Button 
                                variant="outline" 
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2"
                            >
                                <Edit className="w-4 h-4" />
                                Editar
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button 
                                    variant="outline" 
                                    onClick={handleCancel}
                                    className="flex items-center gap-2"
                                >
                                    <X className="w-4 h-4" />
                                    Cancelar
                                </Button>
                                <Button 
                                    onClick={handleSave}
                                    disabled={updating}
                                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white"
                                >
                                    <Save className="w-4 h-4" />
                                    {updating ? 'Guardando...' : 'Guardar Cambios'}
                                </Button>
                            </div>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Imágenes de la Tienda */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Logo */}
                            <div className="space-y-3">
                                <Label>Logo de la Tienda</Label>
                                <div className="flex flex-col items-center space-y-3">
                                    <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                                        {storeProfile?.logo_image ? (
                                            <img 
                                                src={storeProfile.logo_image} 
                                                alt="Logo de la tienda" 
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <Camera className="w-12 h-12 text-gray-400" />
                                        )}
                                        {uploadingImage && (
                                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                                                <div className="text-white text-sm">Subiendo...</div>
                                            </div>
                                        )}
                                    </div>
                                    <Button 
                                        variant="outline" 
                                        onClick={() => triggerFileInput('logo')}
                                        disabled={uploadingImage}
                                        className="flex items-center gap-2"
                                    >
                                        <Upload className="w-4 h-4" />
                                        {uploadingImage ? 'Subiendo...' : 'Cambiar Logo'}
                                    </Button>
                                    <input
                                        ref={logoInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, 'logo')}
                                        className="hidden"
                                    />
                                </div>
                            </div>

                            {/* Banner */}
                            <div className="space-y-3">
                                <Label>Banner de la Tienda</Label>
                                <div className="flex flex-col items-center space-y-3">
                                    <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                                        {storeProfile?.banner_image ? (
                                            <img 
                                                src={storeProfile.banner_image} 
                                                alt="Banner de la tienda" 
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <Camera className="w-12 h-12 text-gray-400" />
                                        )}
                                        {uploadingImage && (
                                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                                                <div className="text-white text-sm">Subiendo...</div>
                                            </div>
                                        )}
                                    </div>
                                    <Button 
                                        variant="outline" 
                                        onClick={() => triggerFileInput('banner')}
                                        disabled={uploadingImage}
                                        className="flex items-center gap-2"
                                    >
                                        <Upload className="w-4 h-4" />
                                        {uploadingImage ? 'Subiendo...' : 'Cambiar Banner'}
                                    </Button>
                                    <input
                                        ref={bannerInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, 'banner')}
                                        className="hidden"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Información de la Tienda */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">Nombre de la Tienda</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={formData.name || ''}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    disabled={!isEditing}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="phone">Teléfono</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={formData.phone || ''}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    disabled={!isEditing}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="web_url">Sitio Web</Label>
                                <Input
                                    id="web_url"
                                    type="url"
                                    value={formData.web_url || ''}
                                    onChange={(e) => handleInputChange('web_url', e.target.value)}
                                    disabled={!isEditing}
                                    className="mt-1"
                                    placeholder="https://ejemplo.com"
                                />
                            </div>
                            <div>
                                <Label htmlFor="whatsapp_url">WhatsApp</Label>
                                <Input
                                    id="whatsapp_url"
                                    type="url"
                                    value={formData.whatsapp_url || ''}
                                    onChange={(e) => handleInputChange('whatsapp_url', e.target.value)}
                                    disabled={!isEditing}
                                    className="mt-1"
                                    placeholder="https://wa.me/1234567890"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="description">Descripción de la Tienda</Label>
                            <Textarea
                                id="description"
                                value={formData.description || ''}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                disabled={!isEditing}
                                className="mt-1"
                                rows={3}
                                placeholder="Describe tu tienda, productos y servicios..."
                            />
                        </div>

                        <div className="text-xs text-gray-500">
                            <p>Formatos de imagen: JPG, PNG, GIF. Máximo 5MB</p>
                            <p>El logo se recomienda en formato cuadrado (1:1) y el banner en formato rectangular (16:9)</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Ajustes Generales */}
                <Card>
                    <CardHeader>
                        <CardTitle>Ajustes Generales</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label className="block text-sm font-medium mb-1">Idioma</Label>
                            <select className="w-full p-2 border rounded-lg">
                                <option>Inglés</option>
                                <option>Español</option>
                                <option>Francés</option>
                            </select>
                        </div>
                        <div>
                            <Label className="block text-sm font-medium mb-1">Moneda</Label>
                            <select className="w-full p-2 border rounded-lg">
                                <option>USD ($)</option>
                                <option>EUR (€)</option>
                                <option>COP ($)</option>
                            </select>
                        </div>
                        <div>
                            <Label className="block text-sm font-medium mb-1">Zona Horaria</Label>
                            <select className="w-full p-2 border rounded-lg">
                                <option>America/Bogota</option>
                                <option>America/New_York</option>
                                <option>Europe/London</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>

                {/* Seguridad */}
                <Card>
                    <CardHeader>
                        <CardTitle>Seguridad</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button variant="outline" className="w-full justify-start">
                            <Settings className="w-4 h-4 mr-2" />
                            Cambiar Contraseña
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                            <Settings className="w-4 h-4 mr-2" />
                            Autenticación de Dos Factores
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                            <History className="w-4 h-4 mr-2" />
                            Historial de Inicio de Sesión
                        </Button>
                    </CardContent>
                </Card>

                {/* Integraciones */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Integraciones</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-3">
                                <Globe className="w-8 h-8 text-blue-500" />
                                <div>
                                    <h3 className="font-medium">WhatsApp Business</h3>
                                    <p className="text-sm text-gray-500">Conectar con clientes</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm">Conectar</Button>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-3">
                                <Package className="w-8 h-8 text-green-500" />
                                <div>
                                    <h3 className="font-medium">Gestión de Inventario</h3>
                                    <p className="text-sm text-gray-500">Sincronizar con sistemas externos</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm">Conectar</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};