import {Form } from "remix"
import { Input } from "~/components/Input"
import { WizardChildHandles } from "~/routes/__wizard"

export const handle: WizardChildHandles = {
    formId: "name-form"
}

export default function Page() {
    return (
        <Form action="../alias" id={handle.formId}>
            <div className="text-sm font-medium pb-8 text-gray-400">Passo 1</div>
            <div className={"pb-10"}>
                <h1 className="text-3xl font-bold">Vamos criar um novo portfólio</h1>
                <h2 className="text-xl font-medium text-gray-400">Como vamos chamá-lo?</h2>
            </div>
            <div className={"w-72"}>
                <Input name="name" label={"Nome do portfólio"} />
            </div>
        </Form>
    )
}