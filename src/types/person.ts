import { Auth } from "@/types/auth";
import { Address } from "@/types/address";

export interface Person {
    id?: bigint;
    created_at?: Date;
    name?: string;
    last_name?: string;
    auth_id?: string; // uuid
    person_type?: bigint;
    adress_id?: bigint;
    username: string;
    // Relaciones opcionales
    Auth?: Auth;
    Address?: Address;
    PersonType?: any; // Person_Catalog
}

