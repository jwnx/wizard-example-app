import classNames from "classnames";
import { Link, LoaderFunction, Outlet, useMatches } from "remix";
import { getChildRoutes } from "~/utils";

export interface SidebarItem {
    readonly name: string
}

export interface SidebarHandle {
    readonly items: Record<string, SidebarItem>
}


export const loader: LoaderFunction = async ({ request }) => {
    const files = getChildRoutes({ currentRoute: "app/routes/__sidebar", request })
    console.log(files)

    return null
}

export default function Sidebar() {
    const matches = useMatches()
    const handle = matches[2].handle as SidebarHandle
    const pathname = matches[2].pathname
    // If a child is selected
    const currentPath = matches[3]?.pathname.split("/").pop()

    return (
        <div className="flex flex-row">
            <nav className="w-64">
                <ul>
                    {Object.entries(handle.items).map(([key, item], index) => {
                        const isSelected = key === currentPath

                        return (
                        <Link key={index} to={`${pathname}/${key}`}>
                            <li key={index} className={classNames("w-52 text-gray-700 rounded-md px-5 py-2 my-1", isSelected ? "bg-gray-100 text-gray-800" : "")}>
                                {item.name}
                            </li>
                        </Link>
                    )})}
                </ul>
            </nav>
            <main className="grow">
                <Outlet />
            </main>
        </div>
    )
}