import { Outlet } from "remix";
import { SidebarHandle } from "~/routes/__sidebar";

export const handle: SidebarHandle = {
    items: {
        "basics": {
            name: "Básicos"
        },
        "billing": {
            name: "Pagamentos"
        }
    }
}

export default function Page() {
    return <Outlet/>
}