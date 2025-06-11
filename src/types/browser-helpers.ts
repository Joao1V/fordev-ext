import { TAB_ACTIONS } from '@/constants';


interface ActionPayloadMap {
   [TAB_ACTIONS.GET_FORM_FIELDS]: null;
   [TAB_ACTIONS.FILL_FIELD]: {
      id: string;
      value: string;
   };
}

export type RequestParams = {
   [K in keyof ActionPayloadMap]: {
      action: K;
      payload: ActionPayloadMap[K];
   }
}[keyof ActionPayloadMap];

