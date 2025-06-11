import { UFBrazil } from '@/constants/states.ts';

export interface AddressData {
   cep: string;
   street: string;
   district: string;
   city: string;
   state: UFBrazil;
   [key: string]: string;
}

export interface Regiao {
   id: number;
   sigla: string;
   nome: string;
}

export interface Estado {
   id: number;
   sigla: string;
   nome: string;
   regiao: Regiao;
}
