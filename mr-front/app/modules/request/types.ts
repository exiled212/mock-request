export type RequestRows = {
  id: number;
  url: string;
  method: string;
}

export type ResponsePendings = {
  data: RequestRows[];
  total: number;
}

export type RequestData = {
  id?: number;
  id_md5?: string;
  url?: string;
  method?: string;
  headers?: {string:[string]};
  queryParams?: {string:[string]};
  body?: any;
}