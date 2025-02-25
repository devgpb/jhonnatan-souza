import Image from "next/image"

export function ContactHero() {
  return (
    <section className="relative h-[40vh] min-h-[400px] flex items-center">
      <Image
        src="/images/imoveis/imovel-5.jpg"
        alt="Entre em contato"
        fill
        className="object-cover brightness-50"
        priority
      />
      <div className="container relative z-10">
        <div className="max-w-2xl space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white">Entre em Contato</h1>
          <p className="text-lg text-white/90">
            Estamos aqui para ajudar você a encontrar o imóvel ideal ou vender seu imóvel pelo melhor valor.
          </p>
        </div>
      </div>
    </section>
  )
}

