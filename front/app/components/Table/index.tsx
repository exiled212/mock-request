import React from 'react';
import {
  Table as TableMU ,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  TableFooter,
  TablePagination,
  Fade,
  ButtonGroup,
  Button,
  Card,
  CardContent,
  Typography,
  CardActions,
  TextField,
  Alert,
  Collapse,
  Box,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid'
import { RequestData, RequestRows } from '~/modules/request/types';
import ButtonSend from '../ButtonSend';
import ButtonDelete from '../ButtonDelete';
import {LoadingButton} from '@mui/lab';
import {
  Autorenew as AutorenewIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';

export default function Table({...props}) {
  const {
    rows,
    pageState,
    rowsPerPageState,
    onChangePage,
    count,
    onSend,
    onGetOne,
    onDelete
  } = props;

  const [page, setPage] = pageState;
  const [rowsPerPage, setRowsPerPage] = rowsPerPageState;

  const selectedState = React.useState<readonly number[]>([]);
  const [selected, setSelected] = selectedState;
  const [domain, setDomain] = React.useState<string>();
  const [currentPending, setCurrentPending] = React.useState<RequestData>({});
  const [insertIsLoading, setInsertIsLoading] = React.useState<boolean>(false);
  const [isReloading, setIsReloading] = React.useState<boolean>(false);

  function pageChange(
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ){
    setSelected([]);
    setPage(newPage);
    onChangePage(newPage, rowsPerPage);
  }

  function perPageChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ){
    const newValue = parseInt(event.target.value, 10);
    setSelected([]);
    setRowsPerPage(newValue);
    setPage(0);
    onChangePage(0, newValue);
  }

  function checkItem(id: number){
    let newSelect;
    if(selected.includes(id)) {
      newSelect = selected.filter(currentId=>currentId!=id);
    } else {
      newSelect = [...selected, id];
    }
    setSelected(newSelect);
  }

  function checkTable(){
    if(selected.length == rows.length) {
      setSelected([]);
    } else {
      const ids = rows.map((row: RequestRows)=>row.id);
      setSelected(ids);
    }
  }

  async function reload(){
    setIsReloading(true);
    setPage(0);
    await onChangePage(0, rowsPerPage);
    setIsReloading(false);
  }

  function buildHeaders (headers?: any) {
    const data = headers || [];
    let result: any = [];
    let i = 0;
    for(let key in data){
      const value: string = data[key];
      const row = {id: i, key, value};
      result.push(row);
      i++;
    }
    return result;
  }

  return (
    <>
      <Collapse in={!!currentPending.id} unmountOnExit={true}>
        <Card sx={{ minWidth: 275 }} variant="outlined">
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Request ID: {currentPending.id}
            </Typography>
            <Box
              component="form"
              noValidate
              autoComplete="off"
            >
              <Grid container spacing={2}>
                <Grid item xs={1}>
                  <TextField
                    fullWidth
                    id="method"
                    label="Method"
                    defaultValue={currentPending.method}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    id="method"
                    label="Url"
                    defaultValue={currentPending.url}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={7}></Grid>
                <Grid item xs={6}>
                  <Typography gutterBottom variant="h5" component="div">
                    Headers
                  </Typography>
                  <Box sx={{ height: 200, bgcolor: 'background.paper' }}>
                    <DataGrid
                      hideFooter
                      rows={buildHeaders(currentPending.headers)}
                      columns={[{field: 'key', width: 400}, {field: 'value', width: 400}]}
                      rowHeight={25}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Typography gutterBottom variant="h5" component="div">
                    Query Params
                  </Typography>
                  <Box sx={{ height: 200, bgcolor: 'background.paper' }}>
                    <DataGrid
                      hideFooter
                      rows={buildHeaders(currentPending.queryParams)}
                      columns={[{field: 'key', width: 400}, {field: 'value', width: 400}]}
                      rowHeight={25}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      id="body"
                      label="Body"
                      InputProps={{ readOnly: true }}
                      defaultValue= {JSON.stringify(currentPending.body)}
                    >
                    </TextField>
                </Grid>
                <Grid item xs={7}></Grid>
              </Grid>
            </Box>
          </CardContent>
          <CardActions>
            <Button onClick={()=>setCurrentPending({})}>Cerrar</Button>
          </CardActions>
        </Card>
      </Collapse>
      <ButtonDelete selectedState={selectedState} onDelete={onDelete} />
      <Fade in={!currentPending.id} {...({ timeout: 500 })} unmountOnExit={true}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <Card sx={{ minWidth: 275 }} variant="outlined">
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Alert severity="info">
                    Ingrese el dominio para poder enviar el request y mockear la respuesta.
                  </Alert>
                </Grid>
                <Grid item xs={12}>
                  <Alert severity="info">
                    Si necesita eliminar algun registro, solo tiene que seleccionarlo con el checkbox y darle al boton de Eliminar Pendientes que aparecera.
                  </Alert>
                </Grid>
                <Grid item xs={12}>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>{!domain?'Ingrese el Dominio':`Dominio: ${domain}`}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography gutterBottom variant="h5" component="div">
                        <TextField
                          fullWidth
                          id="outlined-basic"
                          label="Dominio"
                          variant="outlined"
                          onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>{setDomain(event.target.value)}}
                        />
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>Filtros</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <FormControlLabel control={<Switch defaultChecked={false} />} label="Pendings" />
                          <FormControlLabel control={<Switch defaultChecked={false} />} label="GET" />
                          <FormControlLabel control={<Switch defaultChecked={false} />} label="POST" />
                          <FormControlLabel control={<Switch defaultChecked={false} />} label="PUT" />
                          <FormControlLabel control={<Switch defaultChecked={false} />} label="DELETE" />
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <LoadingButton loading={isReloading} variant="contained" endIcon={<AutorenewIcon/>} onClick={reload}>RELOAD</LoadingButton>
            </CardActions>
          </Card>
          <TableContainer component={Paper}>
            <TableMU sx={{ minWidth: 650 }} size="small" aria-label="caption table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Method</TableCell>
                  <TableCell>Url</TableCell>
                  <TableCell>Crear Response</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={selected.length == rows.length && rows.length > 0}
                      indeterminate={selected.length > 0 && selected.length != rows.length}
                      onChange={checkTable}
                    />
                    Eliminar
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row: RequestRows) => (
                  <TableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">{row.id}</TableCell>
                    <TableCell >{row.method}</TableCell>
                    <TableCell >{row.url}</TableCell>
                    <TableCell >
                      <ButtonGroup variant="contained" aria-label="outlined primary button group">
                        <LoadingButton
                          variant="contained"
                          loading = {insertIsLoading}
                          disabled={!!domain || !!currentPending.id || !!currentPending.body}
                          color={'info'}
                          onClick={
                            async ()=>{
                              setInsertIsLoading(true);
                              const data = await onGetOne(row.id);
                              setInsertIsLoading(false);
                              setCurrentPending(data);
                            }
                          }
                        >Insertar</LoadingButton>
                        <ButtonSend row={row} onSend={onSend} currentPending={currentPending} domain={domain}></ButtonSend>
                      </ButtonGroup>
                    </TableCell>
                    <TableCell>
                      <Checkbox checked={selected.includes(row.id)} onChange={()=>{checkItem(row.id)}} />
                      Eliminar
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[10,25,50]}
                    count={count}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={perPageChange}
                    onPageChange={pageChange}
                    page={page}
                  />
                </TableRow>
              </TableFooter>
            </TableMU>
          </TableContainer>
        </Paper>
      </Fade>
    </>
  );
}
