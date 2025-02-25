import Link from "next/link";
import { Footer } from "@/components/footer";
import { NavBar } from "@/components/nav-bar";

const NotFound = () => {
  return (
    <>
      <NavBar />
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
        <div className="text-center animate-fadeIn opacity-100">
          <h1 className="text-9xl font-bold text-gray-800">404</h1>
          <h2 className="mt-4 text-2xl font-semibold text-gray-700">
            Oops! Página não encontrada
          </h2>
          <p className="mt-2 text-gray-500">
            Parece que a página que você está procurando não existe.
          </p>

          <Link href="/">
            <span className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-lg font-semibold text-white transition hover:bg-blue-700">
              Voltar ao início
            </span>
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NotFound;
