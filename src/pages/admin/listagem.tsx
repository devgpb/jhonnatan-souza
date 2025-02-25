import { SideColumn } from "@/components/admin/side-column";
import { PropertiesTable } from "@/components/admin/table";
import { TableFilter } from "@/components/admin/table-filter";
import { FilterBar } from "@/components/filter-bar";
import SidebarLayout from "@/layouts/SideBarLayout";
import { propertyService } from "@/services/PropertyService"
import { useState, useEffect } from "react"


export default function AdminPropertiesPage() {
  const [imoveis, setImoveis] = useState([])

  const handleSearch = (filters:any) => {
    console.log(filters)
  }


  useEffect(() => {
    fetchBrokers()
  }, [])
  
  const fetchBrokers = async () => {
    const brokers = await propertyService.getProperties()
    setImoveis(brokers)
    console.log(brokers)
  }

  return (
    <SidebarLayout >

      {/* Conteúdo principal */}
      <div className="flex-1 p-4 ml-64">
        {/* Título e descrição */}
        <div className="mb-2"> {/* Reduzida margem inferior */}
          <h1 className="text-2xl font-semibold">Imóveis</h1>
          <p className="text-sm text-gray-500">Visualize todos os imóveis cadastrados no sistema.</p>
        </div>

        {/* Filtros */}
        <div className="bg-white p-2 shadow-sm rounded-lg"> {/* Reduzida margem inferior */}
          
        </div>

        {/* Tabela de imóveis */}
        <div className="bg-white shadow-sm rounded-lg">
        <PropertiesTable properties={imoveis} onDelete={fetchBrokers} />
        </div>
      </div>
    </SidebarLayout>
  );
}
