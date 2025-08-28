import supabase from "@/lib/Supabase";
import { useAuthStore } from "@/stores/authStore";
import { Person } from "@/types/person";
import { useEffect, useState, useCallback } from "react";

export const usePerson = () => {
    const [person, setPerson] = useState<Person | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [updating, setUpdating] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const user = useAuthStore((s) => s.user);
    
    const getPerson = useCallback(async () => {
        if (!user?.id) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const { data, error: supabaseError } = await supabase
                .from('person')
                .select('*')
                .eq('auth_id', user.id)
                .single();
                
            if (supabaseError) {
                setError(supabaseError.message);
                return;
            }
            
            setPerson(data);
        } catch (err) {
            setError('Error al obtener datos de la persona');
            console.error('Error en getPerson:', err);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    const updatePerson = useCallback(async (personData: Partial<Person>) => {
        if (!user?.id || !person?.id) return;
        
        setUpdating(true);
        setError(null);
        
        try {
            const { data, error: supabaseError } = await supabase
                .from('person')
                .update(personData)
                .eq('id', person.id)
                .select()
                .single();
                
            if (supabaseError) {
                setError(supabaseError.message);
                return;
            }
            
            setPerson(data);
            return { success: true, data };
        } catch (err) {
            setError('Error al actualizar datos de la persona');
            console.error('Error en updatePerson:', err);
            return { success: false, error: err };
        } finally {
            setUpdating(false);
        }
    }, [user?.id, person?.id]);

    const uploadProfileImage = useCallback(async (file: File) => {
        if (!user?.id || !person?.id) return;
        
        setUploadingImage(true);
        setError(null);
        
        try {
            // Generar nombre único para la imagen
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}_${Date.now()}.${fileExt}`;
            const filePath = `stores/user_image_profiles/${fileName}`;
            
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
            
            // Actualizar la columna profile_image en la tabla person
            const { data, error: updateError } = await supabase
                .from('person')
                .update({ profile_image: imageUrl })
                .eq('id', person.id)
                .select()
                .single();
                
            if (updateError) {
                setError(updateError.message);
                return { success: false, error: updateError.message };
            }
            
            setPerson(data);
            return { success: true, data, imageUrl };
        } catch (err) {
            setError('Error al subir la imagen de perfil');
            console.error('Error en uploadProfileImage:', err);
            return { success: false, error: err };
        } finally {
            setUploadingImage(false);
        }
    }, [user?.id, person?.id]);

    useEffect(() => {
        if (user?.id) {
            getPerson();
        }
    }, [user?.id, getPerson]);
    
    return {
        person,
        loading,
        error,
        updating,
        uploadingImage,
        getPerson,
        updatePerson,
        uploadProfileImage
    };
};