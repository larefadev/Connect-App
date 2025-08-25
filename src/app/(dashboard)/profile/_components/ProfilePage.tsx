"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Save, Edit, X, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePerson } from "@/hooks/Person/usePerson";
import { useState, useEffect, useRef } from "react";
import { Person } from "@/types/person";
import { useAuthStore } from "@/stores/authStore";

export const ProfilePage = () => {
    const { person, loading, error, updating, uploadingImage, updatePerson, uploadProfileImage } = usePerson();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<Person>>({});
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [imageMessage, setImageMessage] = useState<string | null>(null);
    const email = useAuthStore((state) => state.user);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (person) {
            setFormData({
                name: person.name || '',
                last_name: person.last_name || '',
                profile_image: person.profile_image || ''
            });
        }
    }, [person]);

    const handleInputChange = (field: keyof Person, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        try {
            const result = await updatePerson(formData);
            if (result?.success) {
                setSuccessMessage('Perfil actualizado exitosamente');
                setIsEditing(false);
                setTimeout(() => setSuccessMessage(null), 3000);
            }
        } catch (err) {
            console.error('Error al guardar:', err);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        if (person) {
            setFormData({
                name: person.name || '',
                last_name: person.last_name || '',
                profile_image: person.profile_image || ''
            });
        }
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
            const result = await uploadProfileImage(file);
            if (result?.success) {
                setImageMessage('Imagen de perfil actualizada exitosamente');
                setTimeout(() => setImageMessage(null), 3000);
            } else {
                setImageMessage(result?.error ? String(result.error) : 'Error al subir la imagen');
                setTimeout(() => setImageMessage(null), 3000);
            }
        } catch (err) {
            console.error('Error al subir imagen:', err);
            setImageMessage('Error al subir la imagen');
            setTimeout(() => setImageMessage(null), 3000);
        }

        // Limpiar el input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg">Cargando perfil...</div>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Foto de Perfil</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <div className="w-32 h-32 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden relative">
                            {person?.profile_image ? (
                                <img 
                                    src={person.profile_image} 
                                    alt="Foto de perfil" 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="w-16 h-16 text-gray-400" />
                            )}
                            {uploadingImage && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
                                    <div className="text-white text-sm">Subiendo...</div>
                                </div>
                            )}
                        </div>
                        
                        <div className="space-y-2">
                            <Button 
                                variant="outline" 
                                onClick={triggerFileInput}
                                disabled={uploadingImage}
                                className="w-full flex items-center justify-center gap-2"
                            >
                                <Camera className="w-4 h-4" />
                                {uploadingImage ? 'Subiendo...' : 'Cambiar Foto'}
                            </Button>
                            
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                            
                            <p className="text-xs text-gray-500">
                                Formatos: JPG, PNG, GIF. Máximo 5MB
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Información Personal</CardTitle>
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
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">Nombre</Label>
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
                                <Label htmlFor="lastName">Apellido</Label>
                                <Input
                                    id="lastName"
                                    type="text"
                                    value={formData.last_name || ''}
                                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                                    disabled={!isEditing}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="username">Nombre de Usuario</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    value={person?.username || ''}
                                    disabled={true}
                                    className="mt-1 bg-gray-100"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    El nombre de usuario no se puede modificar
                                </p>
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email?.email || ''}
                                    disabled={true}
                                    className="mt-1 bg-gray-100"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    El email se gestiona desde la configuración de la cuenta
                                </p>
                            </div>
                        </div>
                        
                        {person?.Address && (
                            <div>
                                <Label htmlFor="address">Dirección</Label>
                                <Textarea
                                    id="address"
                                    value={`${person.Address.street || ''} ${person.Address.number || ''} ${person.Address.city?.name || ''} ${person.Address.zipCode || ''}`.trim()}
                                    disabled={true}
                                    className="mt-1 bg-gray-100"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    La dirección se gestiona desde la configuración de la tienda
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Configuración de la Cuenta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <h3 className="font-medium">Notificaciones por Email</h3>
                            <p className="text-sm text-gray-500">Recibe actualizaciones por email sobre tus pedidos</p>
                        </div>
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <h3 className="font-medium">Notificaciones por SMS</h3>
                            <p className="text-sm text-gray-500">Recibe actualizaciones por SMS sobre tus pedidos</p>
                        </div>
                        <input type="checkbox" className="w-4 h-4" />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <h3 className="font-medium">Comunicaciones de Marketing</h3>
                            <p className="text-sm text-gray-500">Recibe emails promocionales y ofertas</p>
                        </div>
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};