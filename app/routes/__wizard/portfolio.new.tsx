import { Outlet } from "remix";
import { WizardHandles } from "../__wizard";

export const handle: WizardHandles = {
    routes: {
        "name": {
            name: "Nome"
        },
        "alias": {
            name: "Alias"
        }
    },
    redirectWhenDone: "/dashboard"
}

export default function Page() {
    return (<Outlet />)
}