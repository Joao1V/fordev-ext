import { useState } from 'react';
import { Button } from '@heroui/react';
import { ArrowLeft, History, Hourglass, RotateCcw } from 'lucide-react';

interface TabTitleProps {
   title: string;
}
export function TabTitle({ title }: TabTitleProps) {
   return <h2 className={'text-xl font-semibold'}>{title}</h2>;
}

interface TitleBarProps {
   title: string;
   isLoading?: boolean;
   isIconOnly?: boolean;
   onGenerate?: () => void;
   onHistory?: () => void;
}

export function TitleBar({ title, isLoading, isIconOnly, onGenerate, onHistory }: TitleBarProps) {
   const [showBackIcon, setShowBackIcon] = useState(false);
   return (
      <div className={'flex justify-between items-center'}>
         {onHistory && (
            <div className={'flex items-center'}>
               <Button
                  isIconOnly
                  size={'sm'}
                  onPress={() => {
                     if (onHistory) {
                        onHistory();
                        setShowBackIcon(!showBackIcon);
                     }
                  }}
                  className={'me-2'}
               >
                  {showBackIcon ? <ArrowLeft size={16} /> : <Hourglass size={16} />}
               </Button>
               <h2 className={'text-xl font-semibold'}>{title}</h2>
            </div>
         )}

         {!onHistory && <h2 className={'text-xl font-semibold'}>{title}</h2>}
         {!showBackIcon && onGenerate && (
            <Button
               color={'primary'}
               isLoading={isLoading}
               isIconOnly={isIconOnly}
               onPress={() => onGenerate()}
            >
               <RotateCcw size={16} />
            </Button>
         )}
      </div>
   );
}
