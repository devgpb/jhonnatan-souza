"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const images = [
  {
    src: "/images/imoveis/imovel-1.jpg",
    alt: "Luxurious modern interior with pool view",
  },
  {
    src: "/images/imoveis/imovel-5.jpg",
    alt: "Elegant property exterior",
  },
  {
    src: "/images/imoveis/imovel-8.jpg",
    alt: "Contemporary living space",
  },
  {
    src: "/images/imoveis/imovel-9.jpg",
    alt: "Modern architectural design",
  },
]

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
    scale: 1,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    scale: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    boxShadow: "0 0px 0px rgba(0,0,0,0)",
    scale: 1,
  }),
}

export function AboutMission() {
  const [[page, direction], setPage] = useState([0, 0])

  useEffect(() => {
    const timer = setInterval(() => {
      setPage(([prevPage, prevDirection]) => [(prevPage + 1) % images.length, 1])
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const imageIndex = Math.abs(page % images.length)

  return (
    <section className="py-16 px-4 sm:py-20 bg-white">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">
          <div className="space-y-4 sm:space-y-6 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold">Nossa Missão</h2>
            <p className="text-base sm:text-lg text-muted-foreground text-justify">
              A Liecon Negócios Imobiliários nasceu com a missão de proporcionar experiências únicas e um atendimento de excelência para clientes que buscam exclusividade, confiança e um serviço diferenciado. Nossa equipe é composta por profissionais altamente treinados, prontos para oferecer o melhor em compra, venda, revenda, locação e administração de imóveis nos melhores bairros de São Paulo.
            </p>
            <p className="text-base sm:text-lg text-muted-foreground text-justify">
              Acreditamos que a tecnologia combinada com atendimento personalizado é a chave para revolucionar o mercado imobiliário e transformar a experiência de compra e venda de imóveis de alto padrão, trazendo transparência, profissionalismo e excelência em todas as etapas do processo.
            </p>
          </div>

          <div className="relative aspect-square w-full max-w-sm sm:max-w-md md:max-w-full mx-auto">
            <div className="absolute inset-4 sm:inset-8 overflow-hidden rounded-2xl w-full h-full">
              <div className="relative w-full h-full">
                <AnimatePresence initial={false} custom={direction}>
                  <motion.div
                    key={page}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 },
                      boxShadow: { duration: 0.4 },
                    }}
                    className="absolute w-full h-full rounded-2xl"
                    style={{
                      backgroundImage: `url(${images[imageIndex].src})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                </AnimatePresence>

                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {images.map((_, index) => (
                    <motion.div
                      key={index}
                      initial={false}
                      animate={{
                        scale: index === imageIndex ? 1.2 : 1,
                        opacity: index === imageIndex ? 1 : 0.5,
                      }}
                      className="w-2 h-2 rounded-full bg-white"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
