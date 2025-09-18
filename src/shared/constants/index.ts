export const MUSILA_ENDPOINT = process.env.MUSILA_ENDPOINT;
export const JWT_MUSILA_BACKEND =
  "Bearer " + localStorage.getItem("token") || "";

export const Urls = {
  genres: {
    all: `${MUSILA_ENDPOINT}/genre`,
    getById: (id: string) => `${MUSILA_ENDPOINT}/genre/${id}`,
  },
  tracks: {
    all: `${MUSILA_ENDPOINT}/track`,
    getById: (id: string) => `${MUSILA_ENDPOINT}/track/${id}`,
  },
};
