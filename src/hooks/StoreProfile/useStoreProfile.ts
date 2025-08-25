import supabase from "@/lib/Supabase";
import { usePerson } from "../Person/usePerson";
import { useEffect, useState, useCallback } from "react";
import { StoreProfile, Store } from "@/types/store";

export const useStoreProfile = () => {
    const { person, loading: personLoading, error: personError } = usePerson();
    const [storeProfile, setStoreProfile] = useState<StoreProfile | null>(null);
    const [store, setStore] = useState<Store | null>(null);
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [storeProfilePublic, setStoreProfilePublic] = useState<StoreProfile | null>(null);
    const [error, setError] = useState<string | null>(null);

    const getStoreByPerson = useCallback(async () => {
        if (!person?.id) return null;
        
        try {
            const { data, error: storeError } = await supabase
                .from('store')
                .select('*')
                .eq('lord_id', person.id)
                .single();
                
            if (storeError) {
                setError(`Error al obtener tienda: ${storeError.message}`);
                return null;
            }
            
            setStore(data);
            return data;
        } catch (err) {
            setError('Error inesperado al obtener tienda');
            console.error('Error en getStoreByPerson:', err);
            return null;
        }
    }, [person?.id]);

    const getStoreProfileByStoreName = async (storeName: string) => {
        if (!storeName) {
            console.log("getStoreProfileByStoreName: storeName es undefined o vacío");
            return null;
        }
        
        try {
            const query = supabase
                .from('store_profile')
                .select('*')
                .eq('name', storeName);
            
            console.log("getStoreProfileByStoreName: Query construida:", query);
            
            const { data, error: profileError } = await query.single();
                
            if (profileError) {
                console.error("Error en getStoreProfileByStoreName:", profileError);
                setError(`Error al obtener perfil de tienda: ${profileError.message}`);
                setStoreProfilePublic(null);
                return null;
            }
            
            console.log("getStoreProfileByStoreName: Perfil encontrado:", data);
            setStoreProfilePublic(data);
            return data;
        } catch (err) {
            console.error("Error inesperado en getStoreProfileByStoreName:", err);
            setError('Error inesperado al obtener perfil de tienda');
            setStoreProfilePublic(null);
            return null;
        }
    };

    const getStoreProfile = useCallback(async () => {
        if (!person?.id) return;
        
        setLoading(true);
        setError(null);
        
        try {
            // Obtener tienda primero
            const storeData = await getStoreByPerson();
            if (!storeData) return;
            
            // Obtener perfil de la tienda
            const { data, error: profileError } = await supabase
                .from('store_profile')
                .select('*')
                .eq('id', storeData.profile_id)
                .single();
                
            if (profileError) {
                setError(`Error al obtener perfil de tienda: ${profileError.message}`);
                return;
            }
            
            setStoreProfile(data);
            console.log("Store Profile obtenido:", data);
        } catch (err) {
            setError('Error inesperado al obtener perfil de tienda');
            console.error('Error en getStoreProfile:', err);
        } finally {
            setLoading(false);
        }
    }, [person?.id, getStoreByPerson]);

    const updateStoreProfile = useCallback(async (profileData: Partial<StoreProfile>) => {
        if (!storeProfile?.id) return;
        
        setUpdating(true);
        setError(null);
        
        try {
            const { data, error: updateError } = await supabase
                .from('store_profile')
                .update(profileData)
                .eq('id', storeProfile.id)
                .select()
                .single();
                
            if (updateError) {
                setError(updateError.message);
                return { success: false, error: updateError.message };
            }
            
            setStoreProfile(data);
            console.log("Store Profile actualizado:", data);
            return { success: true, data };
        } catch (err) {
            setError('Error al actualizar perfil de tienda');
            console.error('Error en updateStoreProfile:', err);
            return { success: false, error: err };
        } finally {
            setUpdating(false);
        }
    }, [storeProfile?.id]);

    const uploadStoreImage = useCallback(async (file: File, imageType: 'logo' | 'banner') => {
        if (!person?.id || !storeProfile?.id) return;
        
        setUploadingImage(true);
        setError(null);
        
        try {
            // Generar nombre único para la imagen
            const fileExt = file.name.split('.').pop();
            const fileName = `${person.id}_${imageType}_${Date.now()}.${fileExt}`;
            const filePath = `stores/store_images/${fileName}`;
            
            // Subir imagen a Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('store-assets')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });
                
            if (uploadError) {
                setError(uploadError.message);
                return { success: false, error: uploadError.message };
            }
            
            // Obtener la URL pública de la imagen
            const { data: urlData } = supabase.storage
                .from('store-assets')
                .getPublicUrl(filePath);
            
            const imageUrl = urlData.publicUrl;
            
            // Actualizar la columna correspondiente en store_profile
            const updateData = imageType === 'logo' 
                ? { logo_image: imageUrl }
                : { banner_image: imageUrl };
            
            const result = await updateStoreProfile(updateData);
            
            if (result?.success) {
                console.log(`${imageType} actualizado:`, imageUrl);
                return { success: true, data: result.data, imageUrl };
            } else {
                return { success: false, error: result?.error };
            }
        } catch (err) {
            setError(`Error al subir ${imageType}`);
            console.error(`Error en uploadStoreImage (${imageType}):`, err);
            return { success: false, error: err };
        } finally {
            setUploadingImage(false);
        }
    }, [person?.id, storeProfile?.id, updateStoreProfile]);

    // Solo ejecutar cuando person esté disponible
    useEffect(() => {
        if (person?.id && !personLoading) {
            getStoreProfile();
        }
    }, [person?.id, personLoading, getStoreProfile]);

    return {
        storeProfile,
        store,
        person,
        loading: loading || personLoading,
        updating,
        uploadingImage,
        error: error || personError,
        getStoreProfile,
        getStoreByPerson,
        getStoreProfileByStoreName,
        updateStoreProfile,
        uploadStoreImage,
        storeProfilePublic
    };
};