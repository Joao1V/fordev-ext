import { RequestParams } from '@/types/browser-helpers.ts';

export async function sendMessageToActiveTab<TResponse = unknown>({
   action,
   payload,
}: RequestParams): Promise<TResponse | null> {
   const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
   const id = tab.id;

   if (id) {
      return await browser.tabs.sendMessage(id, { action: action, payload: payload });
   }

   return null;
}
