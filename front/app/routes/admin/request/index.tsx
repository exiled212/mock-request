import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  Grow
} from '@mui/material';
import { Link, useLoaderData } from 'remix';

export const loader = async ()=> {
  const cardDataList: CardData[] = [
    {
      title: 'Request Pendientes',
      content:
        "En esta sección encontraremos la lista de request que aun no poseen algun response creado, "+
        "aquí podremos definir si queremos agregar un response de forma manual o ejecutarlo para capturar la respuesta"
      , toLabel: 'Ver Pendientes',
      to:'/admin/request/pendings'
    },
    {
      title: 'Request Existentes',
      content:
        "En esta sección podemos ver todos los request realizados, podremos modificar el response."
      , toLabel: 'Ver Todos los request',
      to:'/admin/request/all'
    }
  ]
  return cardDataList;
}

export default function Index() {

  const cards = useLoaderData();

  return (<>
    <h1>Opciones para los Request</h1>
    {cards.map((card: CardData, index: number)=>(
      <Grow
        key={card.title}
        in={true}
        style={{ transformOrigin: '0 0 0' }}
        {...({ timeout: 500*(index+1) })}
      >
        <Card sx={{ minWidth: 275 }} variant="outlined">
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {card.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {card.content}
            </Typography>
          </CardContent>
          <CardActions>
            <Button component={Link} to={card.to} size="small" >{card.toLabel}</Button>
          </CardActions>
        </Card>
      </Grow>
    ))}
  </>);
}

type CardData = {
  title: string;
  content: string;
  toLabel: string;
  to: string;
}
