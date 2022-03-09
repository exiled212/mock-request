import React from 'react';
import { useLoaderData } from 'remix';
import TablePendings from '~/components/Table';
import { getPendings, sendRequest, deleteRequest, getRequest } from '~/modules/request/service';
import type { RequestRows, ResponsePendings } from '~/modules/request/types';

const LIMIT: number = 10;
const PAGE: number = 0;

export const loader = async ()=>{
  return await getPendings(PAGE, LIMIT);
}

export default function Pendings() {
  const result: ResponsePendings = useLoaderData();
  const data: RequestRows[] = result.data;
  const totalRows: number = result.total;

  const rowsPerPageState = React.useState(LIMIT);
  const pageState = React.useState(PAGE);
  const [total, setTotal] = React.useState(totalRows);

  const [pendings, setPendings] = React.useState(data);


  async function onChangePage(page: number, rowsPerPage: number){
    const result: ResponsePendings = await getPendings(page, rowsPerPage);
    const data: RequestRows[] = result.data;
    setPendings(data);
  }

  async function onSend(domain: string, requestId: number, callback: any){
    await sendRequest(domain, requestId);
    callback(setPendings, setTotal)
  }

  async function onDelete(ids: number[]) {
    await deleteRequest(ids);
    const pendings = await getPendings(PAGE, LIMIT);
    setTotal(pendings.total);
    setPendings(pendings.data);
  }

  async function onGetOne(requestId: number) {
    return await getRequest(requestId);
  }

  return (<>
    <TablePendings
      rows = {pendings}
      rowsPerPageState = {rowsPerPageState}
      pageState = {pageState}
      onChangePage = {onChangePage}
      count = {total}
      onSend = {onSend}
      onDelete = {onDelete}
      onGetOne = {onGetOne}
    />
  </>)

}
