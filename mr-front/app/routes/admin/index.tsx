import { redirect } from "remix";

export async function loader(){
  return redirect('/admin/home');
}

export default function Index (){
    return (<></>);
}
