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

