const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const Urls = {
  genres: {
    all: `${API_BASE_URL}/musical-genre`,
    one: (id: string | number) => `${API_BASE_URL}/musical-genre/${id}`,
  },
};

