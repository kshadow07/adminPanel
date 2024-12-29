import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

// Helper function for file upload
const createFormData = (fields: Record<string, any>, file?: File) => {
  const formData = new FormData();
  Object.keys(fields).forEach(key => {
    formData.append(key, fields[key]);
  });
  if (file) {
    formData.append('img', file);
  }
  return formData;
};

export const categoryApi = {
  // Get All Categories
  getCategories: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/categories`);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Get Category by ID
  getCategory: async (id: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching category with id ${id}:`, error);
      throw error;
    }
  },

  // Create Category
  createCategory: async (name: string, file?: File) => {
    try {
      const formData = createFormData({ name }, file);
      const response = await axios.post(`${BASE_URL}/categories`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  // Update Category
  updateCategory: async (id: string, name: string, image: string, file?: File) => {
    try {
      const formData = createFormData({ name, image }, file);
      const response = await axios.put(`${BASE_URL}/categories/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating category with id ${id}:`, error);
      throw error;
    }
  },

  // Delete Category
  deleteCategory: async (id: string) => {
    try {
      const response = await axios.delete(`${BASE_URL}/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting category with id ${id}:`, error);
      throw error;
    }
  }
};

