"use client"

import { useState, useCallback, type ChangeEvent, type FormEvent } from "react"
import { useDropzone } from "react-dropzone"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { IMaskInput } from "react-imask"
import { AlertCircle, Check, ImageIcon, Loader2, Upload, X } from "lucide-react"
import { brokerService } from "@/services/BrokerService"
import { cn } from "@/lib/utils"

interface BrokerValues {
  name: string
  company: string
  creci: string
  phone: string
  email: string
}

const initialValues: BrokerValues = {
  name: "",
  company: "",
  creci: "",
  phone: "",
  email: "",
}

interface FormStatus {
  type: "success" | "error" | null
  message: string
}

export default function BrokerForm() {
  const [broker, setBroker] = useState<BrokerValues>(initialValues)
  const [avatar, setAvatar] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState<FormStatus>({ type: null, message: "" })
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      setAvatar(acceptedFiles[0])
      setAvatarPreview(URL.createObjectURL(acceptedFiles[0]))
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    maxSize: 5242880, // 5MB
    multiple: false,
  })

  const handleBrokerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setBroker((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleBlur = (field: string) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }))
  }

  const removeAvatar = () => {
    setAvatar(null)
    setAvatarPreview(null)
  }

  const validateForm = () => {
    const errors: Partial<Record<keyof BrokerValues, string>> = {}

    if (!broker.name) errors.name = "Nome é obrigatório"
    if (!broker.company) errors.company = "Empresa é obrigatória"
    if (!broker.creci || broker.creci.length !== 6) errors.creci = "CRECI inválido"
    if (!broker.phone) errors.phone = "Telefone é obrigatório"
    if (!broker.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(broker.email)) {
      errors.email = "E-mail inválido"
    }

    return errors
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const errors = validateForm()

    if (Object.keys(errors).length > 0) {
      setStatus({
        type: "error",
        message: "Por favor, corrija os erros no formulário",
      })
      setTouched(
        Object.keys(broker).reduce(
          (acc, key) => ({
            ...acc,
            [key]: true,
          }),
          {},
        ),
      )
      return
    }

    setUploading(true)
    setStatus({ type: null, message: "" })

    try {
      await brokerService.createBroker(broker, avatar)
      setStatus({
        type: "success",
        message: "Corretor cadastrado com sucesso!",
      })
      setBroker(initialValues)
      setAvatar(null)
      setAvatarPreview(null)
      setTouched({})
    } catch (error) {
      console.error("Erro no cadastro:", error)
      setStatus({
        type: "error",
        message: "Erro ao cadastrar corretor. Tente novamente.",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto my-8 px-4">
        <div className="text-center mb-8">
        <h1 className="text-3xl font-bold"> Cadastrar Novo Corretor </h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Coluna da esquerda - Informações principais */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  name="name"
                  value={broker.name}
                  onChange={handleBrokerChange}
                  onBlur={() => handleBlur("name")}
                  placeholder="Ana Silva"
                  className={cn(touched.name && !broker.name && "border-red-500 focus-visible:ring-red-500")}
                />
                {touched.name && !broker.name && <p className="text-sm text-red-500">Nome é obrigatório</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Empresa</Label>
                <Input
                  id="company"
                  name="company"
                  value={broker.company}
                  onChange={handleBrokerChange}
                  onBlur={() => handleBlur("company")}
                  placeholder="Liecon"
                  className={cn(touched.company && !broker.company && "border-red-500 focus-visible:ring-red-500")}
                />
                {touched.company && !broker.company && <p className="text-sm text-red-500">Empresa é obrigatória</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="creci">CRECI</Label>
                <IMaskInput
                  id="creci"
                  name="creci"
                  value={broker.creci}
                  onAccept={(value) => setBroker((prev) => ({ ...prev, creci: value }))}
                  onBlur={() => handleBlur("creci")}
                  mask="000000"
                  placeholder="123456"
                  className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    touched.creci &&
                      (!broker.creci || broker.creci.length !== 6) &&
                      "border-red-500 focus-visible:ring-red-500",
                  )}
                />
                {touched.creci && (!broker.creci || broker.creci.length !== 6) && (
                  <p className="text-sm text-red-500">CRECI inválido</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <IMaskInput
                  id="phone"
                  name="phone"
                  value={broker.phone}
                  onAccept={(value) => setBroker((prev) => ({ ...prev, phone: value }))}
                  onBlur={() => handleBlur("phone")}
                  mask="+{55} (00) 00000-0000"
                  placeholder="+55 (11) 99999-9999"
                  className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    touched.phone && !broker.phone && "border-red-500 focus-visible:ring-red-500",
                  )}
                />
                {touched.phone && !broker.phone && <p className="text-sm text-red-500">Telefone é obrigatório</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={broker.email}
                  onChange={handleBrokerChange}
                  onBlur={() => handleBlur("email")}
                  placeholder="ana.silva@liecon.com.br"
                  className={cn(
                    touched.email &&
                      (!broker.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(broker.email)) &&
                      "border-red-500 focus-visible:ring-red-500",
                  )}
                />
                {touched.email && (!broker.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(broker.email)) && (
                  <p className="text-sm text-red-500">E-mail inválido</p>
                )}
              </div>
            </div>

            {/* Coluna da direita - Avatar e status */}
            <div className="space-y-6">
              <div className="space-y-4">
                <Label>Foto do Perfil</Label>
                <div
                  {...getRootProps()}
                  className={cn(
                    "border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer",
                    isDragActive ? "border-primary bg-primary/5" : "border-gray-200 hover:border-primary",
                  )}
                >
                  <input {...getInputProps()} />
                  {avatarPreview ? (
                    <div className="relative aspect-square w-full max-w-[240px] mx-auto">
                      <img
                        src={avatarPreview || "/placeholder.svg"}
                        alt="Avatar preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeAvatar()
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="flex justify-center">
                        {isDragActive ? (
                          <Upload className="h-10 w-10 text-primary" />
                        ) : (
                          <ImageIcon className="h-10 w-10 text-gray-400" />
                        )}
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">
                          {isDragActive ? "Solte a imagem aqui" : "Arraste uma imagem ou clique para selecionar"}
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG ou GIF (max. 5MB)</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <AnimatePresence mode="wait">
                {status.message && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={cn("p-4 rounded-lg", status.type === "success" ? "bg-green-50" : "bg-red-50")}
                  >
                    <div className="flex items-start gap-3">
                      {status.type === "success" ? (
                        <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      )}
                      <p
                        className={cn(
                          "text-sm font-medium",
                          status.type === "success" ? "text-green-700" : "text-red-700",
                        )}
                      >
                        {status.message}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <Button type="submit" disabled={uploading} className="w-full h-12 text-base font-medium">
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Enviando...
              </>
            ) : (
              "Cadastrar Corretor"
            )}
          </Button>
        </form>
      </div>
  )
}

