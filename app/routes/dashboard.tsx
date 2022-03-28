import { EyeIcon } from "@heroicons/react/outline"
import { CogIcon, StatusOfflineIcon, StatusOnlineIcon } from "@heroicons/react/solid"
import { Portfolio, User } from "@prisma/client"
import classNames from "classnames"
import { useEffect } from "react"
import { json, Link, LoaderFunction, redirect, useLoaderData, useNavigate, useOutletContext } from "remix"
import { prisma } from "~/db.server"
import { NavbarContext } from "~/root"
import { getUser } from "~/session.server"

type LoaderData = {
    readonly user: User
    readonly portfolios: Portfolio[]
}

export const loader: LoaderFunction = async ({ request }) => {
    const user = await getUser(request);

    if (user) {
        const portfolios = await prisma.portfolio.findMany({
            where: { user: { some: { id: user.id }}}
        })

        return json<LoaderData>({
            user: user,
            portfolios,
        })
    }

    return redirect("/")
}

export default function Page() {
    const data = useLoaderData<LoaderData>()
    // Maybe there is a better way to sync backend and front-end information.
    const { portfolio: pfContext } = useOutletContext<NavbarContext>()
    const portfolio = pfContext ?? data.portfolios[0]
    const published = Boolean(portfolio?.alias) && Boolean(portfolio?.description)

    return (
        <main className="pt-6">
            <div className="flex flex-col gap-7">
                <div className="grid grid-cols-4 gap-4 items-start">
                    <span className="lg:col-span-3 md:col-span-2 flex flex-row items-center gap-2">
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard de <span className="px-2 py-1 rounded-md text-gray-900 bg-indigo-50">{portfolio?.name}</span></h1>
                        <span className={classNames(published ? "bg-green-100 text-green-900" : "bg-yellow-100 text-yellow-900", "py-1 px-2 rounded-md flex flex-row items-center h-6 text-sm")}>
                            {published ? <StatusOnlineIcon className="h-4 w-4" /> : <StatusOfflineIcon className="h-4 w-4" />}
                            <span className="pl-1 text-xs font-medium tracking-wide capitalize">{published ? "ativo" : "inativo"}</span>
                        </span>
                    </span>
                    <div className="flex flex-row gap-2 justify-end">
                        <Link className="bg-white py-1 h-10 text-sm px-2 border-gray-200 hover:border-gray-700 hover:bg-gray-50 border rounded-md text-gray-700 font-medium flex flex-row items-center" to="#">
                            <div className="grow-0">
                                <EyeIcon className="h-5 w-5" />
                            </div>
                            <div className="grow pl-2">Ver Portfólio</div>
                        </Link>
                        <Link className="bg-white py-1 h-10 text-sm px-2 border-gray-200 hover:border-gray-700 hover:bg-gray-50 border rounded-md text-gray-700 font-medium flex flex-row items-center" to={`/portfolio/settings/${portfolio?.id}/basics`}>
                            <div className="grow-0">
                                <CogIcon className="h-5 w-5" />
                            </div>
                            <div className="grow pl-2">Configurações</div>
                        </Link>
                    </div>
                </div>
                {!published && (
                    <div className="p-5 bg-yellow-50 rounded-md max-w-screen flex flex-row gap-4 items-start">
                        <span>⚠️</span>
                        <div className="grow flex flex-col gap-1">
                            <h3 className="text-md flex flex-row gap-1 items-end text-yellow-900">
                                Seu portfólio precisa de atenção
                            </h3>
                            <p className="text-yellow-800 leading-5">
                                Por falta de algumas informações, o seu portfólio não pôde ser ativado ainda.<br/>
                                Visite as <Link to={`/portfolio/settings/${portfolio?.id}/basics`} className="font-medium underline">configurações do seu portfólio</Link> para mais detalhes.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}