import { Auth } from "@/types/auth";
import { Address } from "@/types/address";

// Definir interfaz para PersonType
interface PersonType {
    id: bigint;
    name: string;
    description?: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface Person {
    id?: bigint;
    created_at?: Date;
    name?: string;
    last_name?: string;
    auth_id?: string; // uuid
    person_type?: bigint;
    adress_id?: bigint;
    username: string;
    profile_image?: string;
    // Relaciones opcionales
    Auth?: Auth;
    Address?: Address;
    PersonType?: PersonType; // Person_Catalog
}

export interface PersonStatus {
  id: number;
  status: boolean;
  username: string;
  name: string | null;
  last_name: string | null;
  email: string;
}

