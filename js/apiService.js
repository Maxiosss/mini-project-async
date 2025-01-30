const apiKey = "48169121-62c88a9413be0b8e9ebea883d";
const baseUrl = "https://pixabay.com/api/";

export default {
  page: 1,
  query: "",

  async fetchImages() {
    try {
      const url = `${baseUrl}?image_type=photo&orientation=horizontal&q=${this.query}&page=${this.page}&per_page=12&key=${apiKey}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching images:", error.message);
      return { hits: [] };
    }
  },

  resetPage() {
    this.page = 1;
  },

  incrementPage() {
    this.page += 1;
  },
};
