import { Portfolio } from "@prisma/client"
import { ActionFunction, Form, json, LoaderFunction, redirect, useLoaderData } from "remix"
import { z } from "zod"
import { Input } from "~/components/Input"
import { prisma } from "~/db.server"
import { getFormData } from "~/utils"

type LoaderData = {
    readonly portfolio: Portfolio
}

export const loader: LoaderFunction = async ({ request, params }) => {
    const portfolioId = params.portfolioId

    if (!portfolioId) {
        return redirect("/dashboard")
    }

    const portfolio = await prisma.portfolio.findUnique({
        where: { id: portfolioId }
    })

    if (portfolio) {
        return json({
            portfolio
        })
    }

    return redirect("./dashboard")
}

const Schema = z.object({
    name: z.string(),
    alias: z.string().min(3),
    description: z.string(),
});


export const action: ActionFunction = async ({ request, params }) => {
    const formData = await request.formData()
    const portfolioId = params.portfolioId
    const { name, alias, description } = getFormData(formData, Schema)

    await prisma.portfolio.update({
        data: {
            name,
            alias,
            description,
        },
        where: {
            id: portfolioId,
        }
    })

    return null
}


export default function Page() {
    const data = useLoaderData<LoaderData>()

    return (
        <div>
            <h1 className="text-4xl font-bold pb-10">
                Básicos
            </h1>
            <Form method="post" className={"flex flex-col gap-4 max-w-md"}>
                <Input name="name" required defaultValue={data.portfolio.name} label={"Nome do portfólio"} />
                <Input name="alias" required defaultValue={data.portfolio.alias ?? ""} label={`Alias do portfólio ${!data.portfolio.alias ? "⚠️" : ""}`} />
                <Input component="textarea" required name="description" defaultValue={data.portfolio.description ?? ""} label={`Descrição do portfólio ${!data.portfolio.description ? "⚠️" : ""}`} />
                <div className="pt-8">
                    <button
                        type="submit"
                        className={"px-4 py-3 bg-gray-900 text-white rounded-md font-medium"}
                    >Salvar</button>
                </div>
            </Form>
        </div>
    )
}