import { getVisibleForms } from '@/helpers/forms.ts';
import { logger } from '@/scripts/logger.ts';
import { RequestParams } from '@/types/browser-helpers.ts';


export default defineContentScript({
   matches: ['<all_urls>'],
   async main(ctx) {

      browser.runtime.onMessage.addListener((request: RequestParams, sender, sendResponse) => {
         logger(request.action, request.payload);
         const { action } = request;
         if (action === 'GET_FORM_FIELDS') {
            const visibleForms = getVisibleForms();
            console.log('Formulários visíveis:', visibleForms);

            sendResponse(visibleForms);
            return true;
         }


         if (action === 'FILL_FIELD') {
            const { id, value } = request.payload;
            const el = document.getElementById(id);
            if (el) {
               (el as HTMLInputElement).value = value;
               el.dispatchEvent(new Event('input', { bubbles: true }));
            }
            sendResponse({ success: true });
            return true;
         }

      });

      // const observer = new MutationObserver(() => {
      //    console.log('algo mudou no body');
      // });
      //
      // observer.observe(document.body, {
      //    childList: true,
      //    subtree: true
      // });
   },
});
