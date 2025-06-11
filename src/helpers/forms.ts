import { FormField, FormReturn } from '@/types/forms.ts';

function getLabelText<T extends Element>(input: T): string {
   const id = (input as unknown as HTMLInputElement).id;

   if (id) {
      const label = document.querySelector(`label[for="${id}"]`);
      if (label) return label.textContent?.trim() || '';
   }

   const parentLabel = input.closest('label');
   if (parentLabel) return parentLabel.textContent?.trim() || '';

   const parent = input.parentElement;
   if (parent) {
      const label = parent.querySelector('label');
      if (label) return label.textContent?.trim() || '';
   }

   const grandparent = parent?.parentElement;
   if (grandparent) {
      const label = grandparent.querySelector('label');
      if (label) return label.textContent?.trim() || '';
   }

   return '';
}

function isElementVisible(element: HTMLElement): boolean {
   const style = window.getComputedStyle(element);

   // Verifica se o elemento está oculto por CSS
   if (style.display === 'none' ||
      style.visibility === 'hidden' ||
      style.opacity === '0') {
      return false;
   }

   // Verifica se o elemento tem dimensões
   const rect = element.getBoundingClientRect();
   if (rect.width === 0 || rect.height === 0) {
      return false;
   }

   // Verifica se algum elemento pai está oculto
   let parent = element.parentElement;
   while (parent) {
      const parentStyle = window.getComputedStyle(parent);
      if (parentStyle.display === 'none' ||
         parentStyle.visibility === 'hidden') {
         return false;
      }
      parent = parent.parentElement;
   }

   return true;
}

// Função para obter campos de um formulário específico
function getFormFields(form: HTMLFormElement): FormField[] {
   const inputs = Array.from(form.querySelectorAll('input, textarea, select')) as HTMLElement[];

   return inputs
      .filter(input => isElementVisible(input)) // Só pega campos visíveis
      .map((input) => ({
         label: getLabelText(input),
         type: (input as HTMLInputElement).type || '',
         name: input.getAttribute('name') || '',
         id: input.id || '',
         placeholder: input.getAttribute('placeholder') || '',
         value: (input as HTMLInputElement).value || '',
         required: input.hasAttribute('required'),
         disabled: (input as HTMLInputElement).disabled,
      }));
}

// Função para obter apenas formulários visíveis
export function getVisibleForms(): FormReturn[] {
   const allForms = Array.from(document.querySelectorAll('form')) as HTMLFormElement[];

   return allForms
      .filter(form => isElementVisible(form))
      .map((form, index) => ({
         formId: form.id || `form-${index}`,
         fields: getFormFields(form)
      }));
}


// Função para obter um resumo estruturado dos formulários
export function getFormsStructure() {
   const visibleForms = getVisibleForms();

   return {
      totalVisibleForms: visibleForms.length,
      forms: visibleForms.reduce((acc, form) => {
         acc[form.formId] = {
            info: {
               id: form.formId,
               totalFields: form.fields.length
            },
            fields: form.fields
         };
         return acc;
      }, {} as Record<string, any>)
   };
}

export const extractFieldInfo = (element: HTMLElement): FormField => {
   // Obter informações básicas do campo
   const id = element.id || '';
   const name = element.getAttribute('name') || '';
   const type = element.getAttribute('type') || element.tagName.toLowerCase();
   const placeholder = element.getAttribute('placeholder') || '';
   const value = (element as HTMLInputElement).value || '';
   const required = element.hasAttribute('required');
   const disabled = element.hasAttribute('disabled');

   // Tentar obter o label associado ao campo
   let label = '';

   // Método 1: Verificar se há um elemento label com o atributo 'for' apontando para este campo
   if (id) {
      const labelElement = document.querySelector(`label[for="${id}"]`);
      if (labelElement) {
         label = labelElement.textContent?.trim() || '';
      }
   }

   // Método 2: Verificar se o campo está dentro de um elemento label
   if (!label) {
      const parentLabel = element.closest('label');
      if (parentLabel) {
         // Remover o texto do próprio elemento para obter apenas o texto do label
         const labelText = Array.from(parentLabel.childNodes)
            .filter(node => node.nodeType === Node.TEXT_NODE)
            .map(node => node.textContent?.trim())
            .filter(Boolean)
            .join(' ');

         if (labelText) {
            label = labelText;
         }
      }
   }

   // Método 3: Verificar se há algum elemento próximo que pareça um label
   if (!label) {
      const parent = element.parentElement;
      if (parent) {
         const possibleLabels = Array.from(parent.querySelectorAll('label, span, div'))
            .filter(el =>
               el !== element &&
               !el.contains(element) &&
               el.textContent?.trim()
            );

         if (possibleLabels.length > 0) {
            // Pegar o mais próximo
            label = possibleLabels[0].textContent?.trim() || '';
         }
      }
   }

   return {
      id,
      name,
      type,
      label,
      placeholder,
      value,
      required,
      disabled,
   };
};

export const extractAllForms = (): FormReturn[] => {
   const forms = Array.from(document.querySelectorAll('form'));

   return forms.map((form, formIndex) => {
      const formId = form.id || form.getAttribute('name') || `form-${formIndex}`;

      // Selecionar todos os elementos de input, select, textarea dentro do formulário
      const formElements = Array.from(form.querySelectorAll('input, select, textarea, div[class*="select"], div[role="combobox"]'));

      const fields = formElements
         .filter(element => element.tagName !== 'INPUT' || (element as HTMLInputElement).type !== 'hidden')
         .map(element => extractFieldInfo(element as HTMLElement));

      return {
         formId,
         fields
      };
   });
};

export const fillFormField = (fieldId: string, value: string): { success: boolean } => {
   try {
      const element = document.getElementById(fieldId);
      if (!element) return { success: false };

      // Para campos de input padrão
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
         const inputElement = element as HTMLInputElement;

         // Limpar o valor atual
         inputElement.value = '';

         // Definir o novo valor
         inputElement.value = value;

         // Disparar eventos para garantir que o React e outros frameworks detectem a mudança
         const events = ['input', 'change', 'blur'];
         events.forEach(eventType => {
            const event = new Event(eventType, { bubbles: true });
            inputElement.dispatchEvent(event);
         });

         return { success: true };
      }

      // Para selects HTML padrão
      if (element.tagName === 'SELECT') {
         const selectElement = element as HTMLSelectElement;

         // Encontrar a opção que corresponde ao valor
         for (let i = 0; i < selectElement.options.length; i++) {
            if (selectElement.options[i].value === value || selectElement.options[i].text === value) {
               selectElement.selectedIndex = i;

               // Disparar evento de mudança
               const event = new Event('change', { bubbles: true });
               selectElement.dispatchEvent(event);

               return { success: true };
            }
         }
      }

      return { success: false };
   } catch (error) {
      console.error('Erro ao preencher campo de formulário:', error);
      return { success: false };
   }
};

