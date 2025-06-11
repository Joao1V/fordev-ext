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
