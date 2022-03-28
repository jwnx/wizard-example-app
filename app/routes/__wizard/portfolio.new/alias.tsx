import { ActionFunction, Form, json, Link, LoaderFunction, redirect, useLoaderData } from "remix"
import { z } from "zod";
import { Input } from "~/components/Input";
import { prisma } from "~/db.server";
import { WizardChildHandles } from "~/routes/__wizard";
import { getUserId } from "~/session.server";
import { getFormData } from "~/utils";

const Schema = z.object({
    name: z.string(),
    alias: z.string().min(3),
});

export const handle: WizardChildHandles = {
    formId: "alias-form"
}

export const loader: LoaderFunction = ({ request }) => {
    const url = new URL(request.url);
    const name = url.searchParams.get("name");

    if(!name) {
        return redirect("/portfolio/new/name")
    }

    return json({
        name
    })
}

export const action: ActionFunction = async ({ request }) => {
    const userId = await getUserId(request)

    if (!userId) {
        return redirect("/login")
    }

    const data = await request.formData()
    const { name, alias } = getFormData(data, Schema)

    await prisma.portfolio.create({
        data: {
            name,
            alias,
            user: {
                connect: { id: userId }
            }
        }
    })

    return redirect(`/dashboard`)
}


export default function Page() {
    const { name } = useLoaderData()

    return (
        <Form method="post" id={handle.formId} className="w-2/3">
            <div className="text-sm font-medium pb-8 text-gray-400">Passo 2</div>
            <div className={"pb-10"}>
                <h1 className="text-3xl font-bold">Vamos criar um novo portfólio</h1>
                <h2 className="text-xl font-medium text-gray-400">Qual será o domínio?</h2>
                <p className="pt-4 text-gray-700">
                    O domínio do portfólio é único para cada portfólio e ajuda os seus clientes
                    a encontrarem o seu trabalho com mais facilidade. Esta configuração pode ser alterada
                    mais tarde. Para mais detalhes sobre o domínio, consulte a nossa{" "}
                    <Link to="#" className="font-medium underline underline-offset-4">documentação</Link>.
                </p>
            </div>
            <input name="name" type="text" value={name} hidden aria-hidden={true} className="hidden" />
            <Input name="alias" label={"Domínio do portfólio"} />
        </Form>
    )
}