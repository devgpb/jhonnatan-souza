import { useState, useEffect } from "react"
import SidebarLayout from "@/layouts/SideBarLayout"
import { propertyService } from "@/services/PropertyService"
import { PropertiesTable } from "@/components/admin/table" // <-- a tabela que você já tem
import PropertyForm from "@/components/admin/property-form"   // <-- seu form (ajustado p/ edição)

export default function AdminPropertiesPage() {
  const [imoveis, setImoveis] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingProperty, setEditingProperty] = useState(null)

  // Carrega as propriedades ao montar
  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      const data = await propertyService.getProperties()
      setImoveis(data)
    } catch (error) {
      console.error("Erro ao buscar propriedades:", error)
    }
  }

  // 1) Abre o form em modo "novo"
  const handleNewProperty = () => {
    setEditingProperty(null) // limpa qualquer prop em edição
    setShowForm(true)        // exibe o form
  }

  // Fecha o formulário e volta para a tabela
  const handleOpenTable = () => {
    setShowForm(false)
    setEditingProperty(null)
  }

  // 2) Abre o form em modo "editar"
  const handleEditProperty = (property: any) => {
    setEditingProperty(property)
    setShowForm(true)
  }

  // 3) Quando salvar ou excluir, atualiza a lista e volta pra tabela
  const handleFormSuccess = () => {
    setShowForm(false)       // volta para a listagem
    setEditingProperty(null) // limpa o state de edição
    fetchProperties()        // recarrega a tabela
  }

  return (
    <SidebarLayout>
      <div className="flex-1 p-4 ml-64">
        {/* Título */}
        <div className="mb-2">
          <h1 className="text-2xl font-semibold">Imóveis</h1>
          <p className="text-sm text-gray-500">
            Visualize todos os imóveis cadastrados no sistema.
          </p>
        </div>

        {/* Se NÃO estiver mostrando o form, mostra a tabela + botão */}
        {!showForm && (
          <>
            {/* Botão para criar novo imóvel */}
            <div className="flex justify-end mb-4">
              <button
                onClick={handleNewProperty}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Novo Imóvel
              </button>
            </div>
            {/* Tabela de imóveis */}
            <div className="bg-white shadow-sm rounded-lg">
            <PropertiesTable
              properties={imoveis}
              // Chama handleFormSuccess ao apagar
              onDelete={handleFormSuccess}
              // Chama handleEditProperty ao clicar em editar
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
          </>
        )}



        {/* Se showForm === true, mostra o formulário */}
        {showForm && (
          <div className="bg-white shadow-sm rounded-lg p-4">
            <PropertyForm
              // propertyToEdit é a prop que vai habilitar "modo edição"
              propertyToEdit={editingProperty}
              // callback p/ atualizar lista e voltar pra tabela
              onSuccess={handleFormSuccess}
            />
          </div>
        )}
      </div>
    </SidebarLayout>
  )
}
