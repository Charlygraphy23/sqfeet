import axios, { AxiosError } from 'axios';
import { toast } from 'components/alert';
import { useRouter } from 'next/router';

export const axiosInstance = axios.create({
  baseURL: `${process.env.BASE_URL}/api`,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const router = useRouter();

    // @ts-expect-error
    const err: any = error?.response?.data?.msg ?? error?.message;
    toast.error(err);
    if (error.response?.status === 401) {
      router.replace('/');
    }

    return Promise.reject(error);
  }
);

// Add a request interceptor
axios.interceptors.request.use(
  (config) =>
    // Do something before request is sent
    config,
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);
