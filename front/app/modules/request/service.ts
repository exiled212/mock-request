import { RequestData, ResponsePendings } from "./types";
import fetch from 'node-fetch';

const domain = 'http://localhost:3001';

const requesPath = `${domain}/data/request`;
const requesAdminPath = `${domain}/admin/request`;

export const getPendings = async (currentPage: number, maxData: number)=>{
  const {limit, offset} = getOffsetAndLimit(currentPage, maxData);
  return resquestPendings(offset, limit);
}

export const sendRequest = async (domain: string, requedtId: number) => {
  await requestPending(domain, requedtId);
}

export const deleteRequest = async (requestIds: number[]) => {
  await requestDeleteAll(requestIds);
}

export const getRequest = async (requestId: number): Promise<RequestData> => {
  return await requestOne(requestId)
}

async function requestOne(requestId: number){
  const response = await fetch(`${requesPath}/${requestId}`);

  const resultJson: RequestData = await response.json();

  return resultJson;
}

async function resquestPendings(offset: number, limit: number){

  const filters = ['res.id is null'];
  const body = JSON.stringify(filters);

  const response = await fetch(
    `${requesPath}?offset=${offset}&limit=${limit}`,
    {
      method:'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: body
    }
  );

  const resultJson: ResponsePendings = await response.json();

  return resultJson;
}

async function requestPending(domainSend: string, requedtId: number){

  const body = {
    domain: domainSend
  };
  const bodyString = JSON.stringify(body);

  const response = await fetch(
    `${requesAdminPath}/${requedtId}`,
    {
      method:'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: bodyString
    }
  );

  const resultJson: ResponsePendings = await response.json();

  return resultJson;
}

async function requestDeleteAll(requestIds: number[]) {
  const body = JSON.stringify(requestIds);
  const response = await fetch(
    `${requesAdminPath}`,
    {
      method:'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: body
    }
  );

  return response.status;
}

function getOffsetAndLimit(currentPage: number, maxData: number){
  return {
    limit: maxData,
    offset: currentPage*maxData
  };
}