// services/propertyService.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("API_URL não está definida no .env");
}

export const propertyService = {
  async createProperty(data: any) {
    /**
     * Se você estiver enviando arquivos, use FormData.
     * Aqui, assumimos que 'data' pode conter tanto campos quanto arquivos.
     */
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    const response = await fetch(`${API_URL}/property`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Erro ao criar propriedade");
    }
    return response.json();
  },

  async getProperties() {
    const response = await fetch(`${API_URL}/property`);
    if (!response.ok) {
      throw new Error("Erro ao buscar propriedades");
    }
    return response.json();
  },

  async getPropertyById(id: string) {
    const response = await fetch(`${API_URL}/property/${id}`);
    if (!response.ok) {
      throw new Error("Erro ao buscar propriedade");
    }
    return response.json();
  },

  async updateProperty(id: string, data: any) {
    const response = await fetch(`${API_URL}/property/${id}`, {
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
    const response = await fetch(`${API_URL}/property/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Erro ao deletar propriedade");
    }
    return true;
  },
};
