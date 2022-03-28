import {
  json,
  Links,
  LiveReload,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "remix";
import type { LinksFunction, MetaFunction, LoaderFunction } from "remix";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import { getUser } from "./session.server";
import { prisma } from "./db.server";
import { Portfolio } from "@prisma/client";
import { Navbar } from "./components/Navbar";
import { useState } from "react";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Remix Notes",
  viewport: "width=device-width,initial-scale=1",
});

type LoaderData = {
  readonly user: Awaited<ReturnType<typeof getUser>>;
  readonly portfolios: Portfolio[]
};

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

    return json({})
};
export interface NavbarContext {
  readonly portfolio?: Portfolio
}

export default function App() {
  const data = useLoaderData<LoaderData>()
  const [portfolio, onPortfolioChange] = useState<Portfolio | undefined>("portfolios" in data ? data.portfolios[0] : undefined)
  const context: NavbarContext = { portfolio }

  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full max-w-screen-xl mx-auto">
        <Navbar user={data.user ?? undefined} currentPortfolio={portfolio} onPortfolioChange={p => p && onPortfolioChange(p)} portfolios={data.portfolios} />
        <Outlet context={context} />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
