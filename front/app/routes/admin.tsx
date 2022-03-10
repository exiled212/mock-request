import {
  Outlet,
} from "remix";
import Body from "~/components/Body";

export default function Index() {
  return (<>
    <Body>
      <Outlet />
    </Body>
  </>);
}
