import { extractDataFromHtml } from '@/helpers/utils';
import { AddressData } from '@/types/responses';
import forDevsApi from './api';
import { UFBrazil } from '@/constants/states.ts';

async function cpf() {
   const { data } = await forDevsApi.post<string>(
      '/ferramentas_online.php',
      new URLSearchParams({
         acao: 'gerar_cpf',
         pontuacao: 'S',
      }),
   );
   return data;
}

async function cnpj() {
   const { data } = await forDevsApi.post<string>(
      '/ferramentas_online.php',
      new URLSearchParams({
         acao: 'gerar_cnpj',
         pontuacao: 'S',
      }),
   );
   return data;
}

export type CepPayload = {
   acao: 'gerar_cep';
   pontuacao: 'S' | 'N';
   cep_estado?: UFBrazil;
   cep_cidade?: string;
};

async function cep(payload: CepPayload): Promise<AddressData> {

   const { data } = await forDevsApi.post<string>(
      '/ferramentas_online.php',
      new URLSearchParams(payload),
   );

   const fieldMappings = {
      cep: 'cep',
      street: 'endereco',
      district: 'bairro',
      city: 'cidade',
      state: 'estado',
   };

   return extractDataFromHtml<AddressData>(data, fieldMappings);
}

async function fullAddress() {}

export const generate = {
   cpf,
   cnpj,
   cep,
   fullAddress,
};
