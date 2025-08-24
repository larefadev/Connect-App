export interface Preferences {
    id?:number;
    idUser?:number;
    idCategory?:number;
}

export interface PersonCatalogue{
    id?:number;
    name?:string;
}

export interface City{
    id?:number;
    name?:string;
}

export interface Preferences {
    id?:number;
    idPerson?:number;
    idCategory?:number;
}

export interface Adress {
    id?:number;
    city: City;
    zone:string;
    street:string;
}

// Interfaces para productos y categorías
export interface Product {
    SKU: string;
    Nombre?: string;
    Descricpion?: string;
    Precio?: number;
    Imagen?: string;
    Categoria?: string;
    Marca?: string;
}

export interface Category {
    Codigo: string;
    Categoria?: string;
    Nombre?: string;
    Descripcion?: string;
}

export interface ProductFilters {
    categoria?: string;
    marca?: string;
    precioMin?: number;
    precioMax?: number;
    search?: string;
}

