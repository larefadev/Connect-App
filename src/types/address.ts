export interface Address {
    id?: number;
    street?:string;
    number?:string;
    zipCode?:string;
    city?:City;
}

export interface  City{
    id?:number;
    name?:string;
}


