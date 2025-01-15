export interface MovieResponse {
    title: string;
    release_date: string;
    vote_average: number;
    editors: string[];
  }
  
  export interface TMDBMovie {
    id: number;
    title: string;
    release_date: string;
    vote_average: number;
  }
  
  export interface TMDBCredits {
    crew: Array<{
      known_for_department: string;
      name: string;
    }>;
  }
  