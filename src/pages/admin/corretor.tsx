import { useState, useEffect } from "react"
import SidebarLayout from "@/layouts/SideBarLayout"
import BrokerForm from "@/components/admin/broker-form"
import { BrokersTable } from "@/components/admin/brokers/brokers-table"
import { brokerService } from "@/services/BrokerService"
import { Broker } from "@/types/property"

export default function BrokerPage() {
  const [brokers, setBrokers] = useState([])
  const [editingBroker, setEditingBroker] = useState<Broker | undefined>(undefined)

  // Carrega todos os corretores ao montar
  useEffect(() => {
    fetchBrokers()
  }, [])

  const fetchBrokers = async () => {
    try {
      const data = await brokerService.getBrokers()
      setBrokers(data)
    } catch (error) {
      console.error("Erro ao buscar corretores:", error)
    }
  }

  // Callback para recarregar a listagem depois do create/edit
  const handleReloadBrokers = () => {
    fetchBrokers()
  }

  // Callback de edição que vem da tabela
  const handleEditBroker = (broker: any) => {
    setEditingBroker(broker)
    // Se quiser, você pode abrir modal, ou alterar o estado do formulário,
    // ou fazer a navegação para outra rota.
  }

  return (
    <SidebarLayout>
      <div className="flex-1 p-4 ml-64">

        {/* Formulário de criação/edição */}
        <BrokerForm
          // Caso queira reaproveitar para editar, 
          // basta passar a broker prop pro form:
          brokerToEdit={editingBroker}
          onSuccess={handleReloadBrokers}
        />

        {/* Tabela de corretores */}
        <BrokersTable
          brokers={brokers}
          onDelete={handleReloadBrokers}
          onEdit={handleEditBroker}
        />
      </div>
    </SidebarLayout>
  )
}
