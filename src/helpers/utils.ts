
export function extractNumbers<T extends string>(maskedString: T): string {
   if (!maskedString) return '';

   return maskedString.replace(/\D/g, '');
}

export function extractDataFromHtml<T>(
   htmlContent: string,
   fieldMappings: { [K in keyof T]: string },
): T {
   const result = {} as T;

   // Usa expressões regulares para extrair os valores
   for (const [key, id] of Object.entries(fieldMappings)) {
      const regex = new RegExp(`<div id="${id}" class="output-txt"><span>([^<]+)<\\/span>`);
      const match = htmlContent.match(regex);

      if (match && match[1]) {
         (result as any)[key] = match[1];
      } else {
         (result as any)[key] = '';
      }
   }

   return result;
}

export const parseOptions = (html: string) => {
   const div = document.createElement('div');
   div.innerHTML = html;

   const options = Array.from(div.querySelectorAll('option'));

   return options
      .filter((opt) => opt.value) // ignora o option vazio
      .map((opt) => ({
         label: opt.textContent?.trim() || '',
         value: opt.value,
      }));
};

