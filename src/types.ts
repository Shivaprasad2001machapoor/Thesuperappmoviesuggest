export interface UserRegistration {
  name: string;
  username: string;
  email: string;
  mobile: string;
  agreeToTerms: boolean;
}

export type CategoryId =
  | "action"
  | "drama"
  | "romance"
  | "thriller"
  | "western"
  | "horror"
  | "fantasy"
  | "fiction"
  | "music";

export interface Category {
  id: CategoryId;
  name: string;
  color: string; // Background hex code
  borderColor: string; // Border accent color for active state
  iconName: string; // Lucide icon key
}

export interface Movie {
  id: string;
  title: string;
  year: string;
  genre: string;
  rating: string;
  director: string;
  cast: string[];
  plot: string;
  poster: string;
  runtime?: string;
}

export interface NewsStory {
  id: string;
  title: string;
  description: string;
  image: string;
  publishedAt: string;
  source: string;
}

export interface WeatherData {
  source?: string;
  temp: number;
  description: string;
  conditionCode: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  city: string;
}
