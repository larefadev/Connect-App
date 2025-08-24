import supabase from "@/lib/Supabase";
import { useAuthStore } from "@/stores/authStore";
import { Person } from "@/types/person";
import { useEffect, useState, useCallback } from "react";

export const usePerson = () => {
    const [person, setPerson] = useState<Person | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
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
            console.log("Person data ====>", data);
        } catch (err) {
            setError('Error al obtener datos de la persona');
            console.error('Error en getPerson:', err);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        if (user?.id) {
            getPerson();
        }
    }, [user?.id, getPerson]);
    
    return {
        person,
        loading,
        error,
        getPerson
    };
};