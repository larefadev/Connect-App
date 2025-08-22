import supabase from "@/lib/Supabase";
import { usePerson } from "../Person/usePerson";
import { useEffect, useState, useCallback } from "react";

// Definir interfaces para los tipos
interface Store {
    id: string;
    lord_id: string;
    profile_id: string;
    created_at?: string;
    updated_at?: string;
}

interface StoreProfile {
    id: string;
    name: string;
    description?: string;
    logo_url?: string;
    banner_url?: string;
    theme?: string;
    created_at?: string;
    updated_at?: string;
}

export const useStoreProfile = () => {
    const { person, loading: personLoading, error: personError } = usePerson();
    const [storeProfile, setStoreProfile] = useState<StoreProfile | null>(null);
    const [store, setStore] = useState<Store | null>(null);
    const [loading, setLoading] = useState(false);
    const [storeProfilePublic, setStoreProfilePublic] = useState<StoreProfile | null>(null);
    const [error, setError] = useState<string | null>(null);

    const getStoreByPerson = useCallback(async () => {
        if (!person?.id) return null;
        
        try {
            const { data, error: storeError } = await supabase
                .from('Store')
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
        
        console.log("getStoreProfileByStoreName: Buscando tienda con nombre:", storeName);
        console.log("getStoreProfileByStoreName: URL de Supabase:", process.env.NEXT_PUBLIC_SUPABASE_URL);
        
        try {
            const query = supabase
                .from('Profile_Store')
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
                .from('Profile_Store')
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
        error: error || personError,
        getStoreProfile,
        getStoreByPerson,
        getStoreProfileByStoreName,
        storeProfilePublic
    };
};