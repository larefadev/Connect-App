import supabase from "@/lib/Supabase";
import { useAuthStore } from "@/stores/authStore";
import { Person } from "@/types/person";
import { useEffect, useState } from "react";

export const usePerson = () => {
    const [person, setPerson] = useState<Person | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const user = useAuthStore((s) => s.user);
    
    const getPerson = async () => {
        if (!user?.id) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const { data, error: supabaseError } = await supabase
                .from('Person')
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
    }

    useEffect(() => {
        if (user?.id) {
            getPerson();
        }
    }, [user?.id]);
    
    return {
        person,
        loading,
        error,
        getPerson
    };
};