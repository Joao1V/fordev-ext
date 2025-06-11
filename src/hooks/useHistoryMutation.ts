import { useMutationState } from '@tanstack/react-query';

export type MutationKeys = 'generate-cpf' | 'generate-cnpj' | 'generate-cep';
interface Options {
   mutationKey: 'generate-cpf' | 'generate-cnpj' | 'generate-cep';
}

interface HistoryItem<T> {
   data: T;
   variables: any;
   created_at: string;
   timestamp: number;
}

type HistoryMutationReturn<T> = {
   data: Array<HistoryItem<T>>;
   latestAdded: HistoryItem<T> | undefined;
};

const useHistoryMutation = <T = any>(key: MutationKeys, options?: Options): HistoryMutationReturn<T> => {
   const mutationState = useMutationState({
      filters: { mutationKey: [key], status: 'success' },
      select: (mutation) => {
         return {
            data: mutation.state.data,
            variables: mutation.state.variables,
            created_at: new Date(mutation.state.submittedAt).toLocaleString('pt-BR', {
               day: '2-digit',
               month: 'long',
               hour: '2-digit',
               minute: '2-digit',
               hourCycle: 'h23',
            }),
            timestamp: mutation.state.submittedAt,
         } as HistoryItem<T>;
      },
   });
   const data = mutationState
      .filter(Boolean)
      .sort((a, b) => (b?.timestamp || 0) - (a?.timestamp || 0));
   return {
      data,
      latestAdded: data[0],
   };
};

export { useHistoryMutation };
