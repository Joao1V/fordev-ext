import { useEffect, useState } from 'react';
import { useGenerateCpf } from '@/services/mutations';
import { Badge } from '@heroui/badge';
import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { Divider } from '@heroui/divider';
import { Button } from '@heroui/react';
import { sendMessageToActiveTab } from '@/helpers/browser.ts';
import { FormField, FormReturn } from '@/types/forms.ts';
import { ArrowRight } from 'lucide-react';
import { Code } from '@heroui/code';

export default () => {
   const [forms, setForms] = useState<FormReturn[]>([]);
   const [initialLoading, setInitialLoading] = useState(true);
   const updateFormField = (fieldId: string, value: string) => {
      setForms((prevForms) =>
         prevForms.map((form) => ({
            ...form,
            fields: form.fields.map((field) =>
               field.id === fieldId ? { ...field, value } : field,
            ),
         })),
      );
   };

   const onGetCpf = useGenerateCpf();

   const fetchFields = async () => {
      try {
         const response = await sendMessageToActiveTab<FormReturn[]>({
            action: 'GET_FORM_FIELDS',
            payload: null,
         });

         if (response) setForms(response);
      } catch (e) {
         console.log(e);
      }
      setInitialLoading(false);
   };

   const fillField = async (field: FormField) => {
      const value = 'Valor do campo';
      const response = await sendMessageToActiveTab<{ success: boolean }>({
         action: 'FILL_FIELD',
         payload: {
            id: field.id,
            value,
         },
      });

      if (response?.success) {
         updateFormField(field.id, value);
      }
   };

   useEffect(() => {
      fetchFields();
   }, []);
   if (!initialLoading) return (
      <>
         {forms.length === 0 && (
            <h3 className={'text-large text-center'}>Nenhum <Code>form</Code> encontrando</h3>
         )}
         {forms.map((form) => (
            <div>
               <h4 className={'text-2xl mb-4'}>FormId: {form.formId}</h4>
               <div className="space-y-8">
                  {form.fields.map((field, index) => (
                     <div className={'relative'} key={index}>
                        <Chip size="sm" className={'absolute top-[-10px] right-[-5px] z-10'}>
                           ID: {field.id}
                        </Chip>
                        <Card >
                           <CardHeader>
                              <div>
                                 <p className="flex items-center gap-1 text-medium font-semibold">
                                    {field.label || (
                                       <span className={'text-red-400'}>Não identificado</span>
                                    )}{' '}
                                    <div className={'flex gap-1 items-center text-gray-500'}>
                                       <ArrowRight size={16} />
                                       <small className={'text-sm  '}>Type: [{field.type}]</small>
                                    </div>
                                 </p>
                              </div>
                           </CardHeader>

                           <Divider />
                           <CardBody>
                              {field.value ? (
                                 <p className="text-base text-gray-300 ">{field.value}</p>
                              ) : (
                                 <p className="text-sm text-center text-red-500 ">Campo vazio</p>
                              )}
                           </CardBody>
                           <Divider />
                           <CardFooter>
                              <Button
                                 size={'sm'}
                                 onPress={() => fillField(field)}
                                 color={'primary'}
                              >
                                 Opcao 1
                              </Button>
                           </CardFooter>
                        </Card>
                     </div>
                  ))}
               </div>
            </div>
         ))}
      </>
   );
};
