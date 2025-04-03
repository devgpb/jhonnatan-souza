"use client"

import { useState, useCallback, type ChangeEvent, type FormEvent, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { IMaskInput } from "react-imask"
import { AlertCircle, Check, ImageIcon, Loader2, Upload, X } from "lucide-react"
import { brokerService } from "@/services/BrokerService"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"
import { Broker } from "@/types/property"


interface BrokerFormProps {
  brokerToEdit?: Broker
  onSuccess?: () => void  // callback para recarregar lista, fechar modal etc.
}

interface FormStatus {
  type: "success" | "error" | null
  message: string
}

// Estado inicial para "criação"
const initialValues: Broker = {
  name: "",
  company: "",
  creci: "",
  phone: "",
  email: "",
  avatar: "",
}

export default function BrokerForm({ brokerToEdit, onSuccess }: BrokerFormProps) {
  const [broker, setBroker] = useState<Broker>(initialValues)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState<FormStatus>({ type: null, message: "" })
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // Verifica se estamos em modo de edição
  const isEditMode = !!brokerToEdit?.id

  // Quando `brokerToEdit` mudar, preenchemos o form
  useEffect(() => {
    if (brokerToEdit) {
      setBroker(brokerToEdit)
      // Se já houver avatar no broker, mostramos a preview
      if (brokerToEdit.avatar) {
        setAvatarPreview(brokerToEdit.avatar)
      }
    } else {
      // reset se não tiver brokerToEdit
      setBroker(initialValues)
      setAvatarFile(null)
      setAvatarPreview(null)
    }
  }, [brokerToEdit])

  // Função de upload de arquivo no supabase
  const uploadAvatar = async (file: File) => {
    const fileExt = file.name.split(".").pop()
    const fileName = `${broker.name}-${Math.random()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    const { error } = await supabase.storage.from("avatars").upload(filePath, file)
    if (error) throw error

    const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(filePath)
    return publicUrlData?.publicUrl
  }

  // Função que valida o formulário
  const validateForm = () => {
    const errors: Partial<Record<keyof Broker, string>> = {}

    if (!broker.name) errors.name = "Nome é obrigatório"
    if (!broker.company) errors.company = "Empresa é obrigatória"
    if (!broker.creci || broker.creci.length !== 6) errors.creci = "CRECI inválido"
    if (!broker.phone) errors.phone = "Telefone é obrigatório"
    if (!broker.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(broker.email)) {
      errors.email = "E-mail inválido"
    }

    return errors
  }

  // Lidando com drag-and-drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      setAvatarFile(acceptedFiles[0])
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
    setAvatarFile(null)
    setAvatarPreview(null)
    // caso queira remover a foto completamente do broker
    setBroker((prev) => ({ ...prev, avatar: "" }))
  }

  // Submissão do formulário
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus({ type: null, message: "" })

    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setStatus({
        type: "error",
        message: "Por favor, corrija os erros no formulário",
      })
      // Marca todos como 'touched' para exibir as mensagens de erro
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
    try {
      // Se o usuário escolheu uma nova imagem, faz upload e salva a URL
      if (avatarFile) {
        const avatarUrl = await uploadAvatar(avatarFile)
        broker.avatar = avatarUrl || ""
      }

      if (isEditMode && brokerToEdit?.id) {
        // Editando
        await brokerService.updateBroker(brokerToEdit.id.toString(), broker)
        setStatus({ type: "success", message: "Corretor atualizado com sucesso!" })
      } else {
        // Criando
        await brokerService.createBroker(broker)
        setStatus({ type: "success", message: "Corretor cadastrado com sucesso!" })
      }

      // Se tiver callback, chamamos
      onSuccess?.()

      // Reseta o form somente se for criação
      if (!isEditMode) {
        setBroker(initialValues)
        setAvatarFile(null)
        setAvatarPreview(null)
        setTouched({})
      }
    } catch (error) {
      console.error("Erro ao salvar corretor:", error)
      setStatus({
        type: "error",
        message: "Erro ao salvar corretor. Tente novamente.",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto my-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">
          {isEditMode ? "Editar Corretor" : "Cadastrar Novo Corretor"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Coluna da esquerda */}
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
                className={cn(
                  touched.name && !broker.name && "border-red-500 focus-visible:ring-red-500"
                )}
              />
              {touched.name && !broker.name && (
                <p className="text-sm text-red-500">Nome é obrigatório</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Empresa</Label>
              <Input
                id="company"
                name="company"
                value={broker.company}
                onChange={handleBrokerChange}
                onBlur={() => handleBlur("company")}
                placeholder="Jhonnathan"
                className={cn(
                  touched.company && !broker.company && "border-red-500 focus-visible:ring-red-500"
                )}
              />
              {touched.company && !broker.company && (
                <p className="text-sm text-red-500">Empresa é obrigatória</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="creci">CRECI</Label>
              <IMaskInput
                id="creci"
                name="creci"
                mask="000000"
                placeholder="123456"
                value={broker.creci}
                onAccept={(value) =>
                  setBroker((prev) => ({ ...prev, creci: value }))
                }
                onBlur={() => handleBlur("creci")}
                className={cn(
                  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  touched.creci &&
                    (!broker.creci || broker.creci.length !== 6) &&
                    "border-red-500 focus-visible:ring-red-500"
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
                mask="+{55} (00) 00000-0000"
                placeholder="+55 (11) 99999-9999"
                value={broker.phone}
                onAccept={(value) =>
                  setBroker((prev) => ({ ...prev, phone: value }))
                }
                onBlur={() => handleBlur("phone")}
                className={cn(
                  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  touched.phone && !broker.phone && "border-red-500 focus-visible:ring-red-500"
                )}
              />
              {touched.phone && !broker.phone && (
                <p className="text-sm text-red-500">Telefone é obrigatório</p>
              )}
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
                placeholder="ana.silva@jhonnathan.com.br"
                className={cn(
                  touched.email &&
                    (!broker.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(broker.email)) &&
                    "border-red-500 focus-visible:ring-red-500"
                )}
              />
              {touched.email &&
                (!broker.email ||
                  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(broker.email)) && (
                  <p className="text-sm text-red-500">E-mail inválido</p>
              )}
            </div>
          </div>

          {/* Coluna da direita */}
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Foto do Perfil</Label>
              <div
                {...getRootProps()}
                className={cn(
                  "border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer",
                  isDragActive ? "border-primary bg-primary/5" : "border-gray-200 hover:border-primary"
                )}
              >
                <input {...getInputProps()} />
                {avatarPreview ? (
                  <div className="relative aspect-square w-full max-w-[240px] mx-auto">
                    <img
                      src={avatarPreview}
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
                        {isDragActive
                          ? "Solte a imagem aqui"
                          : "Arraste uma imagem ou clique para selecionar"}
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG ou GIF (max. 5MB)
                      </p>
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
                  className={cn(
                    "p-4 rounded-lg",
                    status.type === "success" ? "bg-green-50" : "bg-red-50"
                  )}
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
                        status.type === "success"
                          ? "text-green-700"
                          : "text-red-700"
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
              Salvando...
            </>
          ) : isEditMode ? (
            "Salvar Alterações"
          ) : (
            "Cadastrar Corretor"
          )}
        </Button>
      </form>
    </div>
  )
}
