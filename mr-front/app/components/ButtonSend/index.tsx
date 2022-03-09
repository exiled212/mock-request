import React from 'react';
import {LoadingButton} from '@mui/lab';
import { getPendings } from '~/modules/request/service';
import { ResponsePendings } from '~/modules/request/types';

const LIMIT: number = 10;
const PAGE: number = 0;

export default function ButtonSend({...props}) {
  const {
    row,
    onSend,
    domain,
    currentPending
  } = props;

  const [isLoading, setIsLoading] = React.useState<boolean>(false);


  async function onSendInput(requestId: number){
    setIsLoading(true);
    await onSend(domain, requestId, async (set: any, setTotal: any)=>{
      const pendings: ResponsePendings = await getPendings(PAGE, LIMIT);
      setIsLoading(false);
      set(pendings.data);
      setTotal(pendings.total);
    });
  }

  return (
    <LoadingButton variant="contained" loading={isLoading} disabled={!domain || !!currentPending.id} color={'success'} onClick={()=>onSendInput(row.id)} >Enviar</LoadingButton>
  );

}