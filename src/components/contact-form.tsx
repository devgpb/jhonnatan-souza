"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"

interface FormData {
  nome: string
  email: string
  telefone: string
  tipo: string
  mensagem: string
  termos: boolean
}

const interestOptions = [
  { value: "comprar", label: "Comprar imóvel" },
  { value: "vender", label: "Vender imóvel" },
  { value: "alugar", label: "Alugar imóvel" },
  { value: "investir", label: "Investir em imóveis" },
  { value: "outro", label: "Outro assunto" },
]

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    email: "",
    telefone: "",
    tipo: "",
    mensagem: "",
    termos: false,
  })
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleInterestSelect = (value: string) => {
    setFormData((prev) => ({ ...prev, tipo: value }))
    setIsOpen(false)
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Como podemos ajudar?</h2>
        <p className="text-muted-foreground">
          Preencha o formulário abaixo e nossa equipe entrará em contato o mais breve possível.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome completo</Label>
            <Input
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Digite seu nome completo"
              className="h-12"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Digite seu e-mail"
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                placeholder="Digite seu telefone"
                className="h-12"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Interesse</Label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full h-12 px-3 text-left rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground flex items-center justify-between"
              >
                <span className="text-muted-foreground">
                  {formData.tipo
                    ? interestOptions.find((opt) => opt.value === formData.tipo)?.label
                    : "Selecione seu interesse"}
                </span>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </motion.div>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-10 w-full mt-2 py-2 bg-white rounded-md border border-input shadow-lg"
                  >
                    {interestOptions.map((option) => (
                      <motion.button
                        key={option.value}
                        type="button"
                        onClick={() => handleInterestSelect(option.value)}
                        className="w-full px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground transition-colors"
                        whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {option.label}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mensagem">Mensagem</Label>
            <Textarea
              id="mensagem"
              name="mensagem"
              value={formData.mensagem}
              onChange={handleChange}
              placeholder="Digite sua mensagem"
              className="min-h-[120px] resize-none"
            />
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="termos"
            checked={formData.termos}
            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, termos: checked as boolean }))}
            className="mt-1"
          />
          <label htmlFor="termos" className="text-sm text-muted-foreground">
            Concordo em receber comunicações e aceito a{" "}
            <a href="/privacidade" className="text-primary hover:underline">
              Política de Privacidade
            </a>{" "}
            e os{" "}
            <a href="/termos" className="text-primary hover:underline">
              Termos de Uso
            </a>
            .
          </label>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={!formData.termos}>
          Enviar mensagem
        </Button>
      </form>
    </div>
  )
}

