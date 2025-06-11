// Interface para representar um campo de formulário
export interface FormField {
   label: string;
   type: string;
   name: string;
   id: string;
   placeholder: string;
   value: string;
   required: boolean;
   disabled: boolean;
}

// Interface para representar um formulário
export interface FormReturn {
   formId: string;
   fields: FormField[];
}

// Interface para formulários com informação de visibilidade
export interface FormDataWithVisibility extends FormData {
   isVisible: boolean;
}

// Interface para informações resumidas de um formulário
export interface FormInfo {
   id: string;
   name: string;
   action: string;
   method: string;
   totalFields: number;
}

// Interface para estrutura organizada de formulário
export interface FormStructureItem {
   info: FormInfo;
   fields: FormField[];
}

// Interface para o retorno da função getFormsStructure
export interface FormsStructure {
   totalVisibleForms: number;
   forms: Record<string, FormStructureItem>;
}