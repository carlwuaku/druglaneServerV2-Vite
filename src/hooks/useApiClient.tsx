import { useCallback } from 'react';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { deleteData, getData, postData } from '@/utils/network';

// Types for the hook
interface ApiCallParams {
    url: string;
    params?: Map<string, any> | undefined;
    data?: any;
    config?: AxiosRequestConfig;
    token?: string;
}



export default function useApiClient() {
    const authHeader = useAuthHeader();

    async function getRequest<T>(params: ApiCallParams): Promise<AxiosResponse<T>> {
        if (authHeader) {
            console.log('auth', authHeader)
            params.token = authHeader;
        }
        return await getData(params);
    }

    async function postRequest<T>(params: { url: string, formData: any, token?: string }): Promise<AxiosResponse<T>> {
        if (authHeader) { params.token = authHeader; }
        return await postData(params);
    }

    async function deleteRequest<T>(params: { url: string, token?: string }): Promise<AxiosResponse<T>> {
        if (authHeader) { params.token = authHeader; }
        return await deleteData(params);
    }

    return {
        get: getRequest,
        post: postRequest,
        delete: deleteRequest,
    };

}