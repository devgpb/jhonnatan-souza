import Image from "next/image"

export function AboutHero() {
  return (
    <section className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] flex items-center px-4 sm:px-6 md:px-8">
      <Image src="/images/imoveis/imovel-5.jpg" alt="Sobre a Jhonnathan" fill className="object-cover brightness-50" priority />
      <div className="container relative z-10 text-center sm:text-left">
        <div className="max-w-2xl sm:max-w-3xl space-y-4 sm:space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white">
            Transformando o mercado imobiliário de alto padrão
          </h1>
          <p className="text-lg sm:text-xl text-white/90">
            Conectamos compradores e vendedores a corretores especialistas com acesso ao maior portfólio de imóveis de
            alto padrão de São Paulo.
          </p>
        </div>
      </div>
    </section>
  )
}

