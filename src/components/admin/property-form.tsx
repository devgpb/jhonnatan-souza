"use client"

import type React from "react"

import { useState, useEffect, useCallback, type ChangeEvent, type FormEvent } from "react"
import { useDropzone } from "react-dropzone"
import { motion, AnimatePresence } from "framer-motion"
import * as Progress from "@radix-ui/react-progress"
import {
  AlertCircle, Check, ImageIcon, Loader2, Upload, X, Building2, MapPin, DollarSign, 
  Ruler, BedDouble, Bath, Car, Calendar, Tag, FileText, User, Building
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { brokerService } from "@/services/BrokerService"
import { propertyService } from "@/services/PropertyService"
import { supabase } from "@/lib/supabase"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

// -----------------------------------------------------------
// Tipos para a lista de corretores e valores do form
// -----------------------------------------------------------
interface Broker {
  id: string
  name: string
}

// Adicionar a propriedade 'exclusive' à interface PropertyValues
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
  broker_id: string
  type: string
  exclusive: boolean
  rent?: string
  condominium?: string
  floor?: string | null
}

interface FormStatus {
  type: "success" | "error" | null
  message: string
}

// -----------------------------------------------------------
// Select de corretores com busca (Radix UI)
// -----------------------------------------------------------
interface BrokerSelectProps {
  brokers: Broker[]
  value: string
  onValueChange: (value: string) => void
}

function BrokerSelect({ brokers, value, onValueChange }: BrokerSelectProps) {
  const [search, setSearch] = useState("")
  const filteredBrokers = brokers.filter((b) => b.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-2">
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione um corretor" />
        </SelectTrigger>
        <SelectContent>
          {/* Campo de busca */}
          <div className="p-2">
            <Input
              placeholder="Pesquisar corretor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
              className="w-full"
            />
          </div>

          {/* Lista de opções */}
          {filteredBrokers.length > 0 ? (
            filteredBrokers.map((broker) => (
              <SelectItem key={broker.id} value={String(broker.id)}>
                {broker.name}
              </SelectItem>
            ))
          ) : (
            <div className="px-2 py-4 text-sm text-center text-muted-foreground">Nenhum corretor encontrado</div>
          )}
        </SelectContent>
      </Select>
    </div>
  )
}

// -----------------------------------------------------------
// Valores iniciais do formulário de Imóvel
// -----------------------------------------------------------
// Adicionar o valor padrão 'exclusive: false' ao objeto initialValues
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
  broker_id: "",
  type: "",
  rent: "0",
  condominium: "0",
  floor: null,
  exclusive: false,
}

interface PropertyFormProps {
  propertyToEdit?: Partial<PropertyValues> | null
  onSuccess?: () => void
}

// -----------------------------------------------------------
// Componente principal de cadastro de Imóvel
// -----------------------------------------------------------
export default function PropertyForm({ propertyToEdit, onSuccess }: PropertyFormProps) {
  const [formValues, setFormValues] = useState<PropertyValues>(initialValues)
  const [brokers, setBrokers] = useState<Broker[]>([])
  const [images, setImages] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [newImages, setNewImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState<FormStatus>({ type: null, message: "" })
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [locations, setLocations] = useState<string[]>([])
  const [searchValue, setSearchValue] = useState("")

  // -----------------------------------------------------------
  // 1. Buscar corretores via rota /api/brokers
  // -----------------------------------------------------------
  useEffect(() => {
    fetchBrokers()
    fetchLocations()
  }, [])

  useEffect(() => {
    const fetchProperty = async () => {
      if (!propertyToEdit?.id) return

      try {
      const property = await propertyService.getPropertyById(propertyToEdit.id)

      const { brokers, ...propertyWithoutBrokers } = property

      setFormValues({
        ...initialValues,
        ...propertyWithoutBrokers,
        broker_id: property.broker_id ? property.broker_id : "",
        price: property.price?.toLocaleString("pt-BR", { minimumFractionDigits: 2 }),
        area: property.area?.toString() || "",
        iptu: property.iptu?.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) || "",
        year: property.year?.toString() || "",
        rent: property.rent?.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) || "",
        condominium: property.condominium?.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) || "",
        floor: property.floor?.toString() || "",
        bedrooms: property.bedrooms?.toString() || "",
        bathrooms: property.bathrooms?.toString() || "",
        parking: property.parking?.toString() || "",
        suites: property.suites?.toString() || "",
      })

      // Aqui faz a separação das imagens já existentes
      setExistingImages(property.images || [])
      setImagePreviews(property.images || [])

      // Se tiver diferenciais
      setTags(property.amenities ? property.amenities.split(",") : [])
        } catch (error) {
      console.error("Erro ao buscar imóvel:", error)
      setStatus({
        type: "error",
        message: "Erro ao carregar dados do imóvel.",
      })
      }
    }

    fetchProperty()
  }, [propertyToEdit])

  const fetchBrokers = async () => {
    try {
      const list = await brokerService.getBrokers() // faz GET em /api/brokers
      setBrokers(list)
    } catch (error) {
      console.error("Erro ao carregar corretores:", error)
      setStatus({
        type: "error",
        message: "Erro ao carregar lista de corretores.",
      })
    }
  }

  // -----------------------------------------------------------
  // 2. Upload de imagens (React Dropzone)
  // -----------------------------------------------------------
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setNewImages((prev) => [...prev, ...acceptedFiles])
    const newPreviews = acceptedFiles.map((file) => URL.createObjectURL(file))
    setImagePreviews((prev) => [...prev, ...newPreviews])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".gif"] },
    maxSize: 5242880, // 5MB
  })

  // -----------------------------------------------------------
  // 3. Handlers do formulário
  // -----------------------------------------------------------
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const removeImage = (index: number) => {
    const previewToRemove = imagePreviews[index]

    if (existingImages.includes(previewToRemove)) {
      setExistingImages((prev) => prev.filter((url) => url !== previewToRemove))
    } else {
      setNewImages((prev) => prev.filter((_, i) => i !== index - existingImages.length))
    }

    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  // -----------------------------------------------------------
  // 4. Tags / Diferenciais
  // -----------------------------------------------------------
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

  // -----------------------------------------------------------
  // 5. Validação simples do formulário
  // -----------------------------------------------------------
  const validateForm = () => {
    const errors: Partial<Record<keyof PropertyValues, string>> = {}

    if (!formValues.id) errors.id = "ID é obrigatório"
    if (!formValues.title) errors.title = "Título é obrigatório"
    if (!formValues.location) errors.location = "Localização é obrigatória"
    if (!formValues.price) errors.price = "Preço é obrigatório"
    if (!formValues.area) errors.area = "Área é obrigatória"
    if (!formValues.broker_id) errors.broker_id = "Corretor é obrigatório"
    if (formValues.rent && parseCurrency(formValues.rent) <= 0) {
      errors.rent = "O valor do aluguel deve ser maior que 0"
    }

    return errors
  }

  // -----------------------------------------------------------
  // 6. Upload de imagem para o Supabase Storage
  // -----------------------------------------------------------
  const uploadPropertyImage = async (file: File) => {
    const fileExt = file.name.split(".").pop()
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
    const filePath = `${formValues.id}/${fileName}`

    const { error } = await supabase.storage.from("property-images").upload(filePath, file)
    if (error) throw error

    const { data } = supabase.storage.from("property-images").getPublicUrl(filePath)
    return data?.publicUrl || ""
  }

  // -----------------------------------------------------------
  // 7. Submissão (criação) do Imóvel chamando propertyService
  // -----------------------------------------------------------
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const errors = validateForm()

    if (Object.keys(errors).length > 0) {
      setStatus({
        type: "error",
        message: "Por favor, preencha todos os campos obrigatórios",
      })
      setTouched(Object.keys(formValues).reduce((acc, key) => ({ ...acc, [key]: true }), {}))
      return
    }

    setUploading(true)
    setUploadProgress(0)
    setStatus({ type: null, message: "" })

    try {
      // Envia todas as imagens para o Storage
      const newImageUrls = await Promise.all(newImages.map((file) => uploadPropertyImage(file)))
      const imageUrls = [...existingImages, ...newImageUrls]

      // Prepara o objeto a ser enviado pro seu propertyService
      const propertyData = {
        ...formValues,
        amenities: tags.join(","),
        images: imageUrls,
        // Convertendo strings pra número/boolean onde necessário
        price: formValues.price ? parseCurrency(formValues.price) : null,
        area: formValues.area ? Number.parseFloat(formValues.area) : null,
        iptu: formValues.iptu ? parseCurrency(formValues.iptu) : null,
        year: formValues.year ? Number.parseInt(formValues.year, 10) : null,
        broker_id: formValues.broker_id,
        rent: formValues.rent ? parseCurrency(formValues.rent) : null,
        condominium: formValues.condominium ? parseCurrency(formValues.condominium) : null,
        floor: formValues.floor ? Number.parseInt(formValues.floor, 10) : null,
        bedrooms: formValues.bedrooms ? Number.parseInt(formValues.bedrooms, 10) : 0,
        bathrooms: formValues.bathrooms ? Number.parseInt(formValues.bathrooms, 10) : 0,
        parking: formValues.parking ? Number.parseInt(formValues.parking, 10) : 0,
        // sold já é boolean
      }

      // Cria o imóvel no seu backend via propertyService
      let result
      if (propertyToEdit?.id) {
        // É edição
        result = await propertyService.updateProperty(propertyToEdit.id, propertyData)
        setStatus({ type: "success", message: "Imóvel atualizado com sucesso!" })
      } else {
        // É criação
        result = await propertyService.createProperty(propertyData)
        setStatus({ type: "success", message: "Imóvel cadastrado com sucesso!" })
      }

      setStatus({
        type: "success",
        message: "Imóvel cadastrado com sucesso!",
      })
      // Reseta o formulário
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

  // Função para buscar os bairros (distinct) no Supabase
  async function fetchLocations() {
    try {
      const res = await fetch("/api/properties/locations")
      if (!res.ok) throw new Error(`Request failed with ${res.status}`)
      const data = await res.json()
      setLocations(data) // 'locations' é o state de bairros
    } catch (err) {
      console.error("Erro ao buscar locations:", err)
    }
  }

  function formatCurrency(value: string) {
    const onlyDigits = value.replace(/\D/g, "")
    const number = Number.parseFloat(onlyDigits) / 100
    return number.toLocaleString("pt-BR", { minimumFractionDigits: 2 })
  }

  function parseCurrency(value: string) {
    const normalized = value.replace(/\./g, "").replace(",", ".")
    return Number.parseFloat(normalized)
  }

  // -----------------------------------------------------------
  // Renderização do componente
  // -----------------------------------------------------------
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
            {/* ID do Imóvel */}
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

            {/* Título */}
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

            {/* Localização */}
            <div className="space-y-2">
              <Label htmlFor="location">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Bairro</span>
                </div>
              </Label>
              <Input
                id="location"
                name="location"
                value={formValues.location}
                onChange={(e) => {
                  handleInputChange(e)
                  setSearchValue(e.target.value)
                }}
                onBlur={() => handleBlur("location")}
                list="locations-list"
                placeholder="Itaim Bibi, São Paulo - SP"
                className={cn(touched.location && !formValues.location && "border-red-500 focus-visible:ring-red-500")}
              />
              <datalist id="locations-list">
                {locations
                  .filter((loc) => typeof loc === 'string' && loc.toLowerCase().includes(searchValue.toLowerCase()))
                  .map((loc) => (
                    <option key={loc} value={loc} />
                  ))}
              </datalist>
              {touched.location && !formValues.location && <p className="text-sm text-red-500">Bairro é obrigatório</p>}
            </div>

            {/* Modificar a seção do formulário para adicionar o campo "Exclusivo" logo após o "Tipo do Imóvel" */}
            <div className="space-y-2">
              <Label htmlFor="type">Tipo do Imóvel</Label>
              <Select
                value={formValues.type}
                onValueChange={(value) => setFormValues((prev) => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casa">Casa</SelectItem>
                  <SelectItem value="apartamento">Apartamento</SelectItem>
                  <SelectItem value="cobertura">Cobertura</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="exclusive" className="text-base font-medium flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Exclusividade
              </Label>
              <div
                className="flex items-center gap-4 p-4 rounded-md border border-input bg-background hover:bg-accent/10 transition-colors cursor-pointer"
                onClick={() => setFormValues((prev) => ({ ...prev, exclusive: !prev.exclusive }))}
              >
                <div
                  className={cn(
                    "relative inline-flex h-7 w-14 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    formValues.exclusive ? "bg-primary" : "bg-gray-300",
                  )}
                >
                  <span className="sr-only">Toggle exclusividade</span>
                  <span
                    className={cn(
                      "pointer-events-none inline-block h-6 w-6 rounded-full bg-background shadow-lg ring-0 transition-transform",
                      formValues.exclusive ? "translate-x-7" : "translate-x-0",
                    )}
                  />
                </div>

              </div>
              <p className="text-sm text-muted-foreground">
                Imóveis exclusivos são comercializados apenas por esta imobiliária e recebem destaque especial.
              </p>
            </div>

            {/* Preço */}
            <div className="space-y-2">
              <Label htmlFor="price">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span>Valor</span>
                </div>
              </Label>
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <Input
                    id="price"
                    name="price"
                    value={formValues.price}
                    onChange={(e) => {
                      const formatted = formatCurrency(e.target.value)
                      setFormValues((prev) => ({ ...prev, price: formatted }))
                    }}
                    onBlur={() => handleBlur("price")}
                    placeholder="Ex: 450000"
                    className={cn(touched.price && !formValues.price && "border-red-500 focus-visible:ring-red-500")}
                  />
                  {touched.price && !formValues.price && <p className="text-sm text-red-500">Preço é obrigatório</p>}
                </div>
              </div>
            </div>



            {/* Alugável */}
            <div className="w-full grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <div
                  className="flex items-center justify-between p-4 rounded-md border border-input bg-background hover:bg-accent/10 transition-colors cursor-pointer"
                  onClick={() =>
                    setFormValues((prev) => ({
                      ...prev,
                      rent: prev.rent ? "" : "0",
                    }))
                  }
                >
                  <Label className="text-base font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Alugável
                  </Label>
                  <div
                    className={cn(
                      "relative inline-flex h-7 w-14 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      formValues.rent ? "bg-primary" : "bg-gray-300"
                    )}
                  >
                    <span className="sr-only">Toggle Alugável</span>
                    <span
                      className={cn(
                        "pointer-events-none inline-block h-6 w-6 rounded-full bg-background shadow-lg ring-0 transition-transform",
                        formValues.rent ? "translate-x-7" : "translate-x-0"
                      )}
                    />
                  </div>
                </div>
              </div>

              
            </div>

            <div className="space-y-2">
            {formValues.rent && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-auto w-full md:w-auto">
                  {/* Valor do Aluguel */}
                  <div className="space-y-2">
                    <Label htmlFor="rent">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span>Valor do Aluguel</span>
                      </div>
                    </Label>
                    <Input
                      id="rent"
                      name="rent"
                      value={formValues.rent}
                      onBlur={() => handleBlur("rent")}
                      onChange={(e) => {
                        const formatted = formatCurrency(e.target.value)
                        setFormValues((prev) => ({ ...prev, rent: formatted }))
                      }}
                      placeholder="Ex: 1500"
                      min="0"
                      className={cn(
                        "w-full",
                        touched.rent && parseCurrency(formValues.rent) <= 0 && "border-red-500 focus-visible:ring-red-500"
                      )}
                    />
                    {touched.rent && parseCurrency(formValues.rent) <= 0 && (
                      <p className="text-sm text-red-500">O valor do aluguel deve ser maior que 0</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Se ativado, o valor do aluguel deve ser maior que zero.
                    </p>
                  </div>

                  {/* Valor do Condomínio */}
                  <div className="space-y-2">
                    <Label htmlFor="condominium">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span>Valor do Condomínio</span>
                      </div>
                    </Label>
                    <Input
                      id="condominium"
                      name="condominium"
                      value={formValues.condominium}
                      onBlur={() => handleBlur("condominium")}
                      onChange={(e) => {
                        const formatted = formatCurrency(e.target.value)
                        setFormValues((prev) => ({ ...prev, condominium: formatted }))
                      }}
                      placeholder="Ex: 500"
                      min="0"
                      className={cn(
                        "w-full",
                        touched.condominium &&
                        parseCurrency(formValues.condominium || "0") < 0 &&
                        "border-red-500 focus-visible:ring-red-500"
                      )}
                    />
                    {touched.condominium && parseCurrency(formValues.condominium || "0") < 0 && (
                      <p className="text-sm text-red-500">O valor do condomínio não pode ser negativo</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Informe o valor do condomínio, se aplicável.
                    </p>
                  </div>
                </div>
            )}
            </div>


            {/* IPTU */}
            <div className="space-y-2">
              <Label htmlFor="iptu">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span>Valor do IPTU</span>
                </div>
              </Label>
              <Input
                id="iptu"
                name="iptu"
                value={formValues.iptu}
                onBlur={() => handleBlur("iptu")}
                onChange={(e) => {
                  const formatted = formatCurrency(e.target.value)
                  setFormValues((prev) => ({ ...prev, iptu: formatted }))
                }}
                placeholder="Ex: 150"
                min="0"
                className={cn(
                  "w-full",
                  touched.iptu && parseCurrency(formValues.iptu || "0") < 0 && "border-red-500 focus-visible:ring-red-500"
                )}
              />
              {touched.iptu && parseCurrency(formValues.iptu || "0") < 0 && (
                <p className="text-sm text-red-500">O valor do IPTU não pode ser negativo</p>
              )}
              <p className="text-sm text-muted-foreground">
                Informe o valor do IPTU, se aplicável.
              </p>
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
            {/* Área */}
            <div className="space-y-2">
              <Label htmlFor="area">
                <div className="flex items-center gap-2">
                  <Ruler className="h-4 w-4" />
                  <span>Área (m²)</span>
                </div>
              </Label>
              <Input
                id="area"
                name="area"
                value={formValues.area}
                onChange={handleInputChange}
                onBlur={() => handleBlur("area")}
                placeholder="Ex: 120"
              />
              {touched.area && !formValues.area && <p className="text-sm text-red-500">Área é obrigatória</p>}
            </div>

            {/* Dormitórios */}
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

            {/* Suítes */}
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

            {/* Banheiros */}
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

            {/* Vagas */}
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

            {/* Ano */}
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

            {/* Andar */}
            {formValues.type === "apartamento" && (
              <div className="space-y-2">
                <Label htmlFor="floor">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    <span>Andar</span>
                  </div>
                </Label>
                <Input
                  id="floor"
                  name="floor"
                  type="number"
                  value={formValues.floor ?? ""}
                  onChange={handleInputChange}
                  placeholder="Ex: 5"
                  min="0"
                />
              </div>
            )}
          </div>

          {/* Diferenciais (tags) */}
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
              value={formValues.broker_id}
              onValueChange={(value) => setFormValues((prev) => ({ ...prev, broker_id: value }))}
            />
            {touched.broker_id && !formValues.broker_id && (
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

        {/* Barra de Progresso (caso faça upload por Axios, você pode atualizar o progress) */}
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

        {/* Mensagem de Status */}
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
                <p className={cn("text-sm font-medium", status.type === "success" ? "text-green-700" : "text-red-700")}>
                  {status.message}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botão de Envio */}
        <Button type="submit" disabled={uploading} className="w-full h-12 text-base font-medium">
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Enviando...
            </>
          ) : propertyToEdit?.id ? (
            "Editar Imóvel"
          ) : (
            "Cadastrar Imóvel"
          )}
        </Button>
      </form>
    </div>
  )
}
