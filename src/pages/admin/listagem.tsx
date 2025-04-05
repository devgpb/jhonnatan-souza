import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import SidebarLayout from "@/layouts/SideBarLayout"
import { propertyService } from "@/services/PropertyService"
import { PropertiesTable } from "@/components/admin/table"
import PropertyForm from "@/components/admin/property-form"

export default function AdminPropertiesPage() {
  const router = useRouter()
  const [imoveis, setImoveis] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingProperty, setEditingProperty] = useState(null)

  // Sempre que a rota mudar, recarrega com os novos filtros
  useEffect(() => {
    if (router.isReady) {
      fetchProperties()
    }
  }, [router.query, router.isReady])

  const fetchProperties = async () => {
    try {
      const filters = router.query ?? {}
      console.log("Filtros:", filters)
      const data = await propertyService.getProperties(filters)
      setImoveis(data.data)
    } catch (error) {
      console.error("Erro ao buscar propriedades:", error)
    }
  }

  const handleNewProperty = () => {
    setEditingProperty(null)
    setShowForm(true)
  }

  const handleOpenTable = () => {
    setShowForm(false)
    setEditingProperty(null)
  }

  const handleEditProperty = (property: any) => {
    setEditingProperty(property)
    setShowForm(true)
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingProperty(null)
    fetchProperties()
  }

  return (
    <SidebarLayout>
      <div className="flex-1 p-4 ml-64">
        <div className="mb-2">
          <h1 className="text-2xl font-semibold">Imóveis</h1>
          <p className="text-sm text-gray-500">
            Visualize todos os imóveis cadastrados no sistema.
          </p>
        </div>

        {!showForm && (
          <>
            <div className="flex justify-end mb-4">
              <button
                onClick={handleNewProperty}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Novo Imóvel
              </button>
            </div>

            <div className="bg-white shadow-sm rounded-lg">
              <PropertiesTable
                properties={imoveis}
                onDelete={handleFormSuccess}
                onEdit={handleEditProperty}
              />
            </div>
          </>
        )}

        {showForm && (
          <>
            <div className="flex justify-end mb-4">
              <button
                onClick={handleOpenTable}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Tabela
              </button>
            </div>

            <div className="bg-white shadow-sm rounded-lg p-4">
              <PropertyForm
                propertyToEdit={editingProperty}
                onSuccess={handleFormSuccess}
              />
            </div>
          </>
        )}
      </div>
    </SidebarLayout>
  )
}
