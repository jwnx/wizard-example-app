import classNames from "classnames";
import { Link, Outlet, useMatches } from "remix";

export interface WizardRoute {
    readonly name: string
}

interface HydratedWizardRoute {
    readonly name: string
    readonly route: string
    readonly index: number
}

/**
 * Will be used by wizard pages to configure wizard.
 */
export interface WizardHandles {
    readonly routes: Record<string, WizardRoute>
    readonly redirectWhenDone: string
}

/**
 * Will be used by wizard children to configure which
 * form should be submitted by wizard submit button.
 */
export interface WizardChildHandles {
    readonly formId: string
}

/**
 * Wizard layout function.
 */
export default function Layout() {
    const matches = useMatches()
    const handle = matches[2].handle as WizardHandles
    const pathname = matches[2].pathname

    // If a child is selected
    const childHandle = matches[3]?.handle as WizardChildHandles
    const currentPath = matches[3]?.pathname.split("/").pop()

    const routes: HydratedWizardRoute[] = Object.entries(handle.routes).map(([route, wizardroute], index) => ({
        name: wizardroute.name,
        route: route,
        index
    }))

    const thisRoute = routes.find(r => r.route === currentPath) ?? routes[0]
    const previousRoute = thisRoute.index - 1 < 0 ? undefined : routes[thisRoute.index - 1].route
    console.log(previousRoute)

    return (
        <div className="grid grid-cols-5 gap-x-64 h-5/6">
            <div className="col-span-1 w-64">
                <ul>
                    {Object.entries(handle.routes).map(([key, route], index) => {
                        const isSelected = key === currentPath

                        return (
                            <Link
                                key={index}
                                to={`${pathname}/${key}`}
                            >
                                <li className={
                                    classNames(isSelected ? "font-medium bg-gray-50 rounded-md" : "", " px-2 py-2 flex flex-row items-center gap-3")}>
                                    <span className={"text-sm"}>{index + 1}</span>
                                    <span>{route.name}</span>
                                </li>
                            </Link>
                        )})}
                </ul>
            </div>
            <div className="col-span-4 flex flex-col">
                <div className={"flex-grow"}>
                    <Outlet />
                </div>
                <div className="flex justify-between items-center">
                    <Link
                        to={`${pathname}/${previousRoute}` ?? "#"}
                        className={classNames("block bg-gray-800 text-white font-md px-4 py-2 pt-3 rounded-md h-12", previousRoute ? "" : "invisible")}
                        >
                            {`← Back`}
                    </Link>
                    <button
                        type="submit"
                        form={childHandle.formId}
                        className={"bg-gray-800 text-white font-md px-4 py-2 rounded-md h-12"}
                    >{`Next →`}</button>
                </div>
            </div>
        </div>
    )
}