import { useState } from 'react';
import { useGenerateCpf } from '@/services/mutations';
import { Snippet } from '@heroui/react';
import { extractNumbers } from '@/helpers/utils';
import { LatestAdded } from '@/components/latest-added';
import { TitleBar } from '@/components/tab-title';
import { TableHistory } from '@/components/table-history.tsx';
import { useHistoryMutation } from '@/hooks/useHistoryMutation.ts';

export default () => {
   const { data, mutate, isPending, status } = useGenerateCpf();
   const [isShowHistory, setIsShowHistory] = useState(false);
   const { data: history, latestAdded } = useHistoryMutation<string>('generate-cpf');

   return (
      <div className={'flex flex-col gap-5'}>
         <div>
            <TitleBar
               title={'Gerador de CPF'}
               isLoading={isPending}
               isIconOnly={true}
               onGenerate={() => mutate()}
               onHistory={() => setIsShowHistory(!isShowHistory)}
            />
         </div>

         <div>
            {isShowHistory ? (
               <TableHistory
                  columns={[
                     {
                        key: 'cpf',
                        label: 'CPF',
                     },
                     {
                        key: 'created_at',
                        label: 'CRIADO EM',
                     },
                  ]}
                  rows={history.map((item, index) => ({
                     key: `${index}`,
                     cpf: item?.data,
                     created_at: item?.created_at,
                  }))}
               />
            ) : (
               <div className={'flex flex-col gap-5'}>
                  <Snippet
                     symbol={false}
                     variant="bordered"
                     disableTooltip={true}
                     aria-disabled={!data || isPending}
                     disableCopy={!data || isPending}
                  >
                     {data || ''}
                  </Snippet>

                  <Snippet
                     symbol={false}
                     variant="bordered"
                     disableTooltip={true}
                     aria-disabled={!data || isPending}
                     disableCopy={!data || isPending}
                  >
                     {extractNumbers(data || '')}
                  </Snippet>

                  {latestAdded && status === 'idle' && (
                     <LatestAdded mutationKeys={'generate-cpf'} />
                  )}
               </div>
            )}
         </div>
      </div>
   );
};
