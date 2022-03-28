import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Link, useOutletContext } from "remix";
import { NavbarContext } from "~/root";
import { useOptionalUser } from "~/utils";

export default function Index() {
  const user = useOptionalUser();
  const navigate = useNavigate()
  const { portfolio } = useOutletContext<NavbarContext>()

  useEffect(() => {
    if (portfolio) {
      navigate("/dashboard")
    }
  }, [navigate, portfolio])

  return (
    <main className="sm:flex sm:items-center sm:justify-center">
      {user ? (
        <div className="flex flex-col justify-center align-center items-center text-center text-gray-700 gap-y-4">
          <h1 className="text-3xl font-bold text-gray-200">{`Olá, ${user.email}!`}</h1>
          {portfolio ? (
              <Link to="/dashboard" className="font-medium underline underline-offset-4">Ir para a Dashboard</Link>
            ) :
            (
              <Link to="/portfolio/new/name" className="bg-gray-900 p-3 px-5 text-lg rounded-md text-white font-medium">Crie um portfólio para começar →</Link>
          )}
        </div>
      ) : (
        <div className="flex flex-col justify-center align-center items-center text-center text-gray-700 gap-y-4">
          <h1 className="text-5xl font-bold text-gray-200">Não tem nada aqui 🍃</h1>
          <p className="text-md text-gray-700">
            Parece que você não está usando uma conta.
            <br/>
            <Link to="/login" className="font-medium underline underline-offset-4">
              Entre
            </Link> ou <Link to="/join" className="font-medium underline underline-offset-4">crie a sua conta</Link> para editar conteúdo :)
          </p>
        </div>
      )}
    </main>
  );
}
