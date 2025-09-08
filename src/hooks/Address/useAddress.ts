import supabase from "@/lib/Supabase";
import { AddressResponse } from "@/types/address";
import { useEffect, useState } from "react";

export const useAddress = (id: number) => {
    const [address, setAddress] = useState<AddressResponse | null>(null);

    const getAddressById = async () => {
        const { data, error } = await supabase
            .from('adress')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error(error);
            return null;
        }

        setAddress(data);
    }

    useEffect(() => {
        if (id) {
            getAddressById();
        }
    }, [id]);
    
    return {
        address,
        getAddressById
    }
}