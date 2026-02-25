import api from "./api";

export const materialService = {
  getMaterials: async () => {
    const response = await api.get("/raw-materials");
    return response.data;
  },

  getMaterialByCode: async (code) => {
    const response = await api.get(`/raw-materials/code/${code}`);
    return response.data;
  },

  createMaterial: async (materialData) => {
    const response = await api.post("/raw-materials", materialData);
    return response.data;
  },

  updateStock: async (id, changeValue) => {
    const response = await api.patch(
      `/raw-materials/${id}/stock?quantity=${changeValue}`,
      null,
    );
    return response.data;
  },

  deleteMaterial: async (id) => {
    await api.delete(`/raw-materials/${id}`);
  },
};
