import axios from "axios";
import { Movie, CategoryId } from "../types";
import { categoryMovies } from "../data/movies";

export const fetchMoviesByCategory = async (category: CategoryId): Promise<Movie[]> => {
  try {
    const response = await axios.get(`/api/movies?category=${category}`);
    return response.data.movies || [];
  } catch (error) {
    console.warn(`Express movie proxy unavailable for category ${category}, falling back to local database:`, error);
    return categoryMovies[category] || categoryMovies["action"] || [];
  }
};
