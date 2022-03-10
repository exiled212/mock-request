import React from 'react';
import {
  Zoom,
  Fab
} from '@mui/material';
import {LoadingButton} from '@mui/lab';

export default function ButtonDelete({...props}) {
  const {
    selectedState,
    onDelete
  } = props;

  const [selected, setSelected] = selectedState;

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  return (
    <Zoom in={selected.length > 0} {...({ timeout: 250 })} >
        <Fab
          component={LoadingButton}
          loading={isLoading}
          variant="extended"
          color={'error'}
          onClick= { async ()=>{
            setIsLoading(true);
            await onDelete(selected);
            setSelected([]);
            setIsLoading(false);
          }}
          aria-label="add" sx={{
            position: 'fixed',
            top: 'auto',
            bottom: 20,
            left: 'auto',
            right: 20,
            width:"15em",
            zIndex: 'appBar'
          }}>
          Eliminar Pendientes
        </Fab>
      </Zoom>
  );

}