import { Snippet } from '@heroui/react';
import { MutationKeys, useHistoryMutation } from '@/hooks/useHistoryMutation.ts';

interface LatestAddedProps {
   mutationKeys: MutationKeys
   isHiddenSnippet?: boolean;
}

export function LatestAdded(props: LatestAddedProps) {
   const { latestAdded } = useHistoryMutation<any>(props.mutationKeys);

   return (
      <div>
         <p className={'flex justify-between text-medium mb-3 text-gray-200'}>
            Último criado: <small className={'text-gray-300'}>{latestAdded?.created_at}</small>
         </p>
         {!props.isHiddenSnippet && (
            <Snippet
               symbol={false}
               variant="bordered"
               disableTooltip={true}
               className={'flex justify-center'}
            >
               {latestAdded?.data}
            </Snippet>
         )}

      </div>
   );
}
