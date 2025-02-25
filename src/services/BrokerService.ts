// services/brokerService.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("API_URL não está definida no .env");
}

export const brokerService = {
    async createBroker(data: any, avatar: File | null) {
        const formData = new FormData();
        // Adiciona os campos do broker
        for (const key in data) {
            formData.append(key, data[key]);
        }
        // Se houver avatar, adiciona o arquivo
        if (avatar) {
            formData.append('avatar', avatar);
        }

        console.log(formData);

        const response = await fetch(`${API_URL}/broker`, {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) {
            throw new Error("Erro ao criar broker");
        }
        return response.json();
    },

  async getBrokers() {
    const response = await fetch(`${API_URL}/broker`);
    if (!response.ok) {
      throw new Error("Erro ao buscar brokers");
    }
    return response.json();
  },

  async getBrokerById(id: string) {
    const response = await fetch(`${API_URL}/broker/${id}`);
    if (!response.ok) {
      throw new Error("Erro ao buscar broker");
    }
    return response.json();
  },

  async updateBroker(id: string, data: any) {
    const response = await fetch(`${API_URL}/broker/${id}`, {
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
    const response = await fetch(`${API_URL}/broker/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Erro ao deletar broker");
    }
    return true;
  },
};
