import { Card, CardTitle, CardHeader, Button, CardContent, Label, Input, Textarea } from "@/components"
import { StoreProfile } from "@/types/store";
import { Camera, Edit, Save, Store, Upload, X } from "lucide-react"


interface UpdateSettingFormProps {
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
    handleCancel: () => void;
    handleSave: () => void;
    updating: boolean;
    logoInputRef: React.RefObject<HTMLInputElement>;
    bannerInputRef: React.RefObject<HTMLInputElement>;
    storeProfile: StoreProfile;
    uploadingImage: boolean;
    handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>, imageType: 'logo' | 'banner') => void;
    triggerFileInput: (imageType: 'logo' | 'banner') => void;
    handleInputChange: (field: keyof StoreProfile, value: string) => void;
    formData: StoreProfile;
}



export const UpdateSettingForm = (props: UpdateSettingFormProps) => {
    const { 
        isEditing, 
        setIsEditing, 
        handleCancel, 
        handleSave, 
        updating,
        logoInputRef,
        formData , 
        storeProfile , 
        uploadingImage,
        handleImageUpload,
        triggerFileInput,
        handleInputChange,
        bannerInputRef
    } = props;

    return (
        <>
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
        </>
    )
}