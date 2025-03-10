// services/brokerService.ts

const API_BASE = "/api/brokers";

export const brokerService = {
  async createBroker(data: any) {
    const response = await fetch(`${API_BASE}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Erro ao criar broker");
    }
    return response.json();
  },

  async getBrokers() {
    const response = await fetch(`${API_BASE}`);
    if (!response.ok) {
      throw new Error("Erro ao buscar brokers");
    }
    return response.json();
  },

  async getBrokerById(id: string) {
    const response = await fetch(`${API_BASE}/${id}`);
    if (!response.ok) {
      throw new Error("Erro ao buscar broker");
    }
    return response.json();
  },

  async updateBroker(id: string, data: any) {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Erro ao atualizar broker");
    }
    return response.json();
  },

  async deleteBroker(id: string) {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Erro ao deletar broker");
    }
    return true;
  },
};
