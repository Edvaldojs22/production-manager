import api from "./api";

export const productService = {
  getAll: async () => {
    const response = await api.get("/products");
    return response.data;
  },

  create: async (productData) => {
    const response = await api.post("/products", productData);
    return response.data;
  },

  getProductionSuggestion: async () => {
    const response = await api.get("/products/suggest");
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/products/${id}`);
  },

  upadateMaterials: async (id, materialsList) => {
    await api.put(`/products/${id}`, materialsList);
  },
};
