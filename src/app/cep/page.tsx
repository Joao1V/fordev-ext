import { useState } from 'react';
import forDevsApi from '@/services/api';
import { useGenerateCep } from '@/services/mutations.ts';
import { Autocomplete, AutocompleteItem } from '@heroui/autocomplete';
import { Input } from '@heroui/input';
import { Snippet } from '@heroui/snippet';
import { parseOptions } from '@/helpers/utils.ts';
import { TitleBar } from '@/components/tab-title';
import { useHistoryMutation } from '@/hooks/useHistoryMutation';
import { addressTranslate } from '@/constants';
import { UFBrazil, states } from '@/constants/states.ts';
import { AddressData } from '@/types/responses.ts';
import { useQuery } from '@tanstack/react-query';
import { LatestAdded } from '@/components/latest-added.tsx';

interface CityData {
   label: string;
   value: string;
}
export default () => {
   const { latestAdded } = useHistoryMutation<AddressData>('generate-cep');
   const { data, mutate, isPending, status } = useGenerateCep();
   const [selectedState, setSelectedState] = useState<UFBrazil | undefined>(
      latestAdded?.variables?.state
   );
   const [selectedCityId, setSelectedCityId] = useState<string | undefined>(
      latestAdded?.variables?.cityId
   );

   const { data: cities, isPending: isPendingCities } = useQuery<CityData[]>({
      queryKey: ['city-list', selectedState],
      queryFn: async (context) => {
         const [key, uf] = context.queryKey;
         const { data } = await forDevsApi.post(
            '/ferramentas_online.php',
            new URLSearchParams({
               acao: 'carregar_cidades',
               cep_estado: uf as string,
            }),
         );
         return parseOptions(data);
      },
      enabled: !!selectedState,
      staleTime: Infinity,
      gcTime: Infinity,
   });


   return (
      <div className={'flex flex-col justify-between'}>
         <div className={'flex flex-col gap-5 pb-5'}>
            <TitleBar
               title={'Gerador de CEP'}
               isLoading={isPending}
               isIconOnly={true}
               onGenerate={() =>
                  mutate({
                     state: selectedState,
                     cityId: selectedCityId,
                  })
               }
            />
            {(latestAdded && status === 'idle') && (
               <div>
                  <LatestAdded mutationKeys={'generate-cep'} isHiddenSnippet/>
               </div>
            )}

            {states && (
               <div className={'flex gap-3'}>
                  <Autocomplete
                     className="max-w-[125px]"
                     label="Estado"
                     maxListboxHeight={200}
                     variant="bordered"
                     defaultInputValue={selectedState}
                     onSelectionChange={(key) => {
                        if (key) {
                           setSelectedState(key as UFBrazil);
                        } else {
                           setSelectedState(undefined);
                        }
                     }}
                  >
                     {states.map((state) => (
                        <AutocompleteItem key={state.uf}>{state.uf}</AutocompleteItem>
                     ))}
                  </Autocomplete>

                  <Autocomplete
                     className="max-w-xs"
                     label="Cidade"
                     isLoading={!!selectedState && isPendingCities}
                     maxListboxHeight={200}
                     variant="bordered"
                     isDisabled={!selectedState}
                     defaultInputValue={
                        cities?.find((i) => i.value === selectedCityId)?.label || undefined
                     }
                     onSelectionChange={(key) => {
                        console.log(key);
                        if (key) {
                           setSelectedCityId(key as string);
                        } else {
                           setSelectedCityId(undefined);
                        }
                     }}
                     defaultItems={cities || []}
                  >
                     {(item) => (
                        <AutocompleteItem key={item.value} className="capitalize">
                           {item.label}
                        </AutocompleteItem>
                     )}
                  </Autocomplete>
               </div>
            )}

            <Snippet
               symbol={false}
               variant="bordered"
               disableTooltip={true}
               aria-disabled={!data || isPending}
               disableCopy={!data || isPending}
            >
               {data?.cep || latestAdded?.data?.cep || ''}
            </Snippet>

            <div className="flex flex-wrap gap-4">
               {[
                  {
                     key: 'street',
                     className: 'capitalize w-100',
                  },
                  {
                     key: 'district',
                     className: 'capitalize w-100',
                  },
                  {
                     key: 'city',
                     className: 'capitalize flex-1',
                     value: cities?.find((i) => i.value === selectedCityId)?.label,
                  },
                  {
                     key: 'state',
                     className: 'capitalize w-1/3',
                     value: selectedState,
                  },
               ].map((field, index) => (
                  <Input
                     key={index}
                     label={addressTranslate[field.key]}
                     className={field.className}
                     type="text"
                     readOnly={true}
                     isDisabled={(!data && isPending) || !latestAdded}
                     value={
                        field?.value
                           ? field.value
                           : data?.[field.key] || latestAdded?.data[field.key] || ''
                     }
                     variant={'bordered'}
                  />
               ))}
            </div>
         </div>
      </div>
   );
};
