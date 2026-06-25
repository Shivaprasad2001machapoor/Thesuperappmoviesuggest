import axios from "axios";
import { NewsStory } from "../types";
import { newsStories } from "../data/news";

export const fetchTopHeadlines = async (): Promise<NewsStory[]> => {
  try {
    const response = await axios.get("/api/news");
    return response.data.stories || [];
  } catch (error) {
    console.warn("Express news proxy unavailable, falling back to local database:", error);
    return newsStories;
  }
};
