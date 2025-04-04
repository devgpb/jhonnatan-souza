// services/propertyService.ts
const API_BASE = "/api/properties";

export const propertyService = {
  async createProperty(data: any) {
    const response = await fetch(`${API_BASE}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erro ao criar propriedade");
    }
    return response.json();
  },

  async getProperties(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const url = queryParams ? `${API_BASE}?${queryParams}` : `${API_BASE}`;
  
    const response = await fetch(url);
  
    if (!response.ok) {
      throw new Error("Erro ao buscar propriedades");
    }
  
    return response.json();
  },
  

  async getPropertyById(id: string) {
    const response = await fetch(`${API_BASE}/${id}`);
    if (!response.ok) {
      throw new Error("Erro ao buscar propriedade");
    }
    return response.json();
  },

  async updateProperty(id: string, data: any) {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Erro ao atualizar propriedade");
    }
    return response.json();
  },

  async deleteProperty(id: string) {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Erro ao deletar propriedade");
    }
    return true;
  },


  async markAsSold(id: string) {
    const response = await fetch(`${API_BASE}/sold`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ propertyId: id }),
    });

    if (!response.ok) {
      throw new Error("Erro ao marcar propriedade como vendida");
    }
    return response.json();
  }
};
