import axios from 'axios';

export const nqdApi = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL, timeout: 10000 });
