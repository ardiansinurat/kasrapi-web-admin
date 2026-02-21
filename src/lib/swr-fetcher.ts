import apiClient from './api';

export const fetcher = (url: string) => apiClient.get(url).then((res) => res.data);
