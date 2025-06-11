import { UFBrazil } from '@/constants/states.ts';
import { useMutation } from '@tanstack/react-query';
import { AddressData } from '../types/responses';
import { CepPayload, generate } from './generators';

export const useGenerateCpf = () => {
   return useMutation({
      mutationKey: ['generate-cpf'],
      mutationFn: generate.cpf,
   });
};

export const useGenerateCnpj = () => {
   return useMutation({
      mutationKey: ['generate-cnpj'],
      mutationFn: generate.cnpj,
   });
};

export const useGenerateCep = () => {
   return useMutation<AddressData, Error, { state?: UFBrazil; cityId?: string }>({
      mutationKey: ['generate-cep'],
      mutationFn: async (variables) => {
         const { state, cityId } = variables;
         const payload: CepPayload = {
            acao: 'gerar_cep',
            pontuacao: 'S',
         };
         if (state) {
            payload.cep_estado = state;
         }
         if (cityId) {
            if (cityId.length > 0) payload.cep_cidade = cityId;
         }
         return await generate.cep(payload);
      },
   });
};
