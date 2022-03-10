import { Skeleton } from '@mui/material';
import { redirect } from 'remix';

export async function loader(){
  return redirect('/admin/home');
}

export default function Index() {
  return (<>
    <Skeleton variant="rectangular" width={'100%'} height={'3.7em'} sx={{ mt:0 }} />
    <Skeleton variant="rectangular" width={'100%'} height={'90vh'} sx={{ mt:1 }} />
  </>);

}
