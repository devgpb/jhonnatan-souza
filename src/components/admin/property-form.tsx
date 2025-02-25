"use client"

import { useState, useEffect, useCallback, type ChangeEvent, type FormEvent } from "react"
import { useDropzone } from "react-dropzone"
import { motion, AnimatePresence } from "framer-motion"
import * as Progress from "@radix-ui/react-progress"
import * as Select from "@radix-ui/react-select"
import {
  AlertCircle,
  Check,
  ChevronDown,
  ImageIcon,
  Loader2,
  Upload,
  X,
  Building2,
  MapPin,
  DollarSign,
  Ruler,
  BedDouble,
  Bath,
  Car,
  Calendar,
  Tag,
  FileText,
  User,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IMaskInput } from "react-imask"
import { cn } from "@/lib/utils"
import { brokerService } from "@/services/BrokerService"
import axios from "axios"

interface PropertyValues {
  id: string
  title: string
  location: string
  price: string
  area: string
  bedrooms: string
  sold: boolean
  year: string
  iptu: string
  suites: string
  bathrooms: string
  parking: string
  description: string
  brokerId: string
}

interface Broker {
  id: string
  name: string
}

interface FormStatus {
  type: "success" | "error" | null
  message: string
}

// Componente customizado de Select com pesquisa usando Radix UI
interface BrokerSelectProps {
  brokers: Broker[]
  value: string
  onValueChange: (value: string) => void
}

function BrokerSelect({ brokers, value, onValueChange }: BrokerSelectProps) {
  const [search, setSearch] = useState("")
  const filteredBrokers = brokers.filter((broker) => broker.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <Select.Root value={value} onValueChange={onValueChange}>
      <Select.Trigger className="w-full inline-flex items-center justify-between rounded-md border border-input bg-background px-3 h-10">
        <Select.Value placeholder="Selecione um corretor">
          {value ? brokers.find((b) => b.id === value)?.name : "Selecione um corretor"}
        </Select.Value>
        <Select.Icon>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="w-[--radix-select-trigger-width] bg-white rounded-md border shadow-lg">
          <div className="p-2">
            <Input
              placeholder="Pesquisar corretor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
              className="w-full"
            />
          </div>
          <Select.Viewport className="p-1 max-h-60">
            <Select.Group>
              {filteredBrokers.length > 0 ? (
                filteredBrokers.map((broker) => (
                  <Select.Item
                    key={broker.id}
                    value={broker.id}
                    className="relative flex items-center px-8 py-2 rounded-sm text-sm cursor-default hover:bg-accent hover:text-accent-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground outline-none"
                  >
                    <Select.ItemText>{broker.name}</Select.ItemText>
                    <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                      <Check className="h-4 w-4" />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))
              ) : (
                <div className="px-2 py-4 text-sm text-center text-muted-foreground">Nenhum corretor encontrado</div>
              )}
            </Select.Group>
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}

const initialValues: PropertyValues = {
  id: "",
  title: "",
  location: "",
  price: "",
  area: "",
  bedrooms: "",
  sold: false,
  year: "",
  iptu: "",
  suites: "",
  bathrooms: "",
  parking: "",
  description: "",
  brokerId: "",
}

export default function PropertyForm() {
  const [formValues, setFormValues] = useState<PropertyValues>(initialValues)
  const [brokers, setBrokers] = useState<Broker[]>([])
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState<FormStatus>({ type: null, message: "" })
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")

  // Carrega os corretores quando o componente é montado
  useEffect(() => {
    fetchBrokers()
  }, [])

  const fetchBrokers = async () => {
    try {
      const brokers = await brokerService.getBrokers()
      setBrokers(brokers)
    } catch (error) {
      console.error("Erro ao carregar corretores:", error)
      setStatus({
        type: "error",
        message: "Erro ao carregar lista de corretores.",
      })
    }
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setImages((prev) => [...prev, ...acceptedFiles])
    const newPreviews = acceptedFiles.map((file) => URL.createObjectURL(file))
    setImagePreviews((prev) => [...prev, ...newPreviews])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    maxSize: 5242880, // 5MB
  })

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleBlur = (field: string) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }))
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      const trimmed = tagInput.trim()
      if (trimmed && !tags.includes(trimmed)) {
        setTags((prev) => [...prev, trimmed])
      }
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove))
  }

  const validateForm = () => {
    const errors: Partial<Record<keyof PropertyValues, string>> = {}

    if (!formValues.id) errors.id = "ID é obrigatório"
    if (!formValues.title) errors.title = "Título é obrigatório"
    if (!formValues.location) errors.location = "Localização é obrigatória"
    if (!formValues.price) errors.price = "Preço é obrigatório"
    if (!formValues.area) errors.area = "Área é obrigatória"
    if (!formValues.brokerId) errors.brokerId = "Corretor é obrigatório"

    return errors
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const errors = validateForm()

    if (Object.keys(errors).length > 0) {
      setStatus({
        type: "error",
        message: "Por favor, preencha todos os campos obrigatórios",
      })
      setTouched(
        Object.keys(formValues).reduce(
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
    setUploadProgress(0)
    setStatus({ type: null, message: "" })

    try {
      const formData = new FormData()
      Object.entries(formValues).forEach(([key, value]) => {
        formData.append(key, value.toString())
      })

      formData.append("amenities", tags.join(","))
      images.forEach((file) => formData.append("images", file))

      await axios.post("http://localhost:3001/property", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            setUploadProgress(percent)
          }
        },
      })

      setStatus({
        type: "success",
        message: "Imóvel cadastrado com sucesso!",
      })
      setFormValues(initialValues)
      setImages([])
      setImagePreviews([])
      setTags([])
      setTouched({})
    } catch (error) {
      console.error("Erro no cadastro:", error)
      setStatus({
        type: "error",
        message: "Erro ao cadastrar imóvel. Tente novamente.",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto my-8">
      <div>
        <h1 className="text-3xl font-bold text-center">Cadastrar Novo Imóvel</h1>
      </div>
      
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informações Básicas */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-xl font-semibold">Informações Básicas</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="id">ID do Imóvel</Label>
                <Input
                  id="id"
                  name="id"
                  value={formValues.id}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur("id")}
                  placeholder="Ex: AVA660"
                  className={cn(touched.id && !formValues.id && "border-red-500 focus-visible:ring-red-500")}
                />
                {touched.id && !formValues.id && <p className="text-sm text-red-500">ID é obrigatório</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  name="title"
                  value={formValues.title}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur("title")}
                  placeholder="Apartamento de Alto Padrão"
                  className={cn(touched.title && !formValues.title && "border-red-500 focus-visible:ring-red-500")}
                />
                {touched.title && !formValues.title && <p className="text-sm text-red-500">Título é obrigatório</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>Localização</span>
                  </div>
                </Label>
                <Input
                  id="location"
                  name="location"
                  value={formValues.location}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur("location")}
                  placeholder="Itaim Bibi, São Paulo - SP"
                  className={cn(
                    touched.location && !formValues.location && "border-red-500 focus-visible:ring-red-500",
                  )}
                />
                {touched.location && !formValues.location && (
                  <p className="text-sm text-red-500">Localização é obrigatória</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span>Preço</span>
                  </div>
                </Label>
                <IMaskInput
                  id="price"
                  name="price"
                  value={formValues.price}
                  onAccept={(value) => setFormValues((prev) => ({ ...prev, price: value }))}
                  onBlur={() => handleBlur("price")}
                  mask="R$ num"
                  blocks={{
                    num: {
                      mask: Number,
                      thousandsSeparator: ".",
                      radix: ",",
                      scale: 2,
                      padFractionalZeros: true,
                      normalizeZeros: true,
                      min: 0,
                    },
                  }}
                  unmask={true}
                  placeholder="R$ 0,00"
                  className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                    touched.price && !formValues.price && "border-red-500 focus-visible:ring-red-500",
                  )}
                />
                {touched.price && !formValues.price && <p className="text-sm text-red-500">Preço é obrigatório</p>}
              </div>
            </div>
          </div>

          <Separator />

          {/* Características */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-xl font-semibold">Características</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="area">
                  <div className="flex items-center gap-2">
                    <Ruler className="h-4 w-4" />
                    <span>Área (m²)</span>
                  </div>
                </Label>
                <IMaskInput
                  id="area"
                  name="area"
                  value={formValues.area}
                  onAccept={(value) => setFormValues((prev) => ({ ...prev, area: value }))}
                  onBlur={() => handleBlur("area")}
                  mask={Number}
                  scale={2}
                  radix=","
                  thousandsSeparator="."
                  unmask={true}
                  placeholder="Ex: 120,00"
                  className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                    touched.area && !formValues.area && "border-red-500 focus-visible:ring-red-500",
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bedrooms">
                  <div className="flex items-center gap-2">
                    <BedDouble className="h-4 w-4" />
                    <span>Dormitórios</span>
                  </div>
                </Label>
                <Input
                  id="bedrooms"
                  name="bedrooms"
                  type="number"
                  value={formValues.bedrooms}
                  onChange={handleInputChange}
                  placeholder="Ex: 3"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="suites">
                  <div className="flex items-center gap-2">
                    <Bath className="h-4 w-4" />
                    <span>Suítes</span>
                  </div>
                </Label>
                <Input
                  id="suites"
                  name="suites"
                  type="number"
                  value={formValues.suites}
                  onChange={handleInputChange}
                  placeholder="Ex: 1"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bathrooms">
                  <div className="flex items-center gap-2">
                    <Bath className="h-4 w-4" />
                    <span>Banheiros</span>
                  </div>
                </Label>
                <Input
                  id="bathrooms"
                  name="bathrooms"
                  type="number"
                  value={formValues.bathrooms}
                  onChange={handleInputChange}
                  placeholder="Ex: 2"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="parking">
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    <span>Vagas</span>
                  </div>
                </Label>
                <Input
                  id="parking"
                  name="parking"
                  type="number"
                  value={formValues.parking}
                  onChange={handleInputChange}
                  placeholder="Ex: 1"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Ano</span>
                  </div>
                </Label>
                <Input
                  id="year"
                  name="year"
                  type="number"
                  value={formValues.year}
                  onChange={handleInputChange}
                  placeholder="Ex: 2023"
                  min="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Diferenciais</Label>
              <div className="flex flex-wrap gap-2 border rounded-md p-3">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-primary/10 text-primary rounded-full px-3 py-1 text-sm"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-primary/70 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Digite e pressione Enter para adicionar..."
                  className="flex-1 min-w-[200px] border-0 focus-visible:ring-0"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Descrição e Corretor */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="description">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-xl font-semibold">Descrição</h2>
                </div>
              </Label>
              <textarea
                id="description"
                name="description"
                value={formValues.description}
                onChange={handleInputChange}
                placeholder="Descreva os detalhes do imóvel..."
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[120px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="broker">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-xl font-semibold">Corretor Responsável</h2>
                </div>
              </Label>
              <BrokerSelect
                brokers={brokers}
                value={formValues.brokerId}
                onValueChange={(value) => setFormValues((prev) => ({ ...prev, brokerId: value }))}
              />
              {touched.brokerId && !formValues.brokerId && (
                <p className="text-sm text-red-500">Corretor é obrigatório</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Upload de Imagens */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-xl font-semibold">Imagens do Imóvel</h2>
            </div>

            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer",
                isDragActive ? "border-primary bg-primary/5" : "border-gray-200 hover:border-primary",
              )}
            >
              <input {...getInputProps()} />
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
                    {isDragActive ? "Solte as imagens aqui" : "Arraste imagens ou clique para selecionar"}
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG ou GIF (max. 5MB por imagem)</p>
                </div>
              </div>
            </div>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {imagePreviews.map((src, index) => (
                  <div key={index} className="relative group aspect-square">
                    <img
                      src={src || "/placeholder.svg"}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {uploading && (
            <div className="space-y-2">
              <Progress.Root
                className="relative h-4 w-full overflow-hidden rounded-full bg-secondary"
                value={uploadProgress}
              >
                <Progress.Indicator
                  className="h-full bg-primary transition-all duration-300 ease-in-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </Progress.Root>
              <p className="text-sm text-center text-muted-foreground">Enviando... {uploadProgress}%</p>
            </div>
          )}

          {/* Status Message */}
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
                    className={cn("text-sm font-medium", status.type === "success" ? "text-green-700" : "text-red-700")}
                  >
                    {status.message}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <Button type="submit" disabled={uploading} className="w-full h-12 text-base font-medium">
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Enviando...
              </>
            ) : (
              "Cadastrar Imóvel"
            )}
          </Button>
        </form>
    </div>
  )
}

