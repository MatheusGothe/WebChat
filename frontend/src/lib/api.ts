"use server";

import { APIError } from "@/types/Api";
import axios, { AxiosError } from "axios";
import { cookies } from "next/headers";

type Props = {
    endpoint: string;
    method?: "GET" | "POST" | "DELETE" | "PUT";
    data?: object;
    withAuth?: boolean;
    withAttachment?: boolean;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL + "/api/v1";

export const api = async <TypeResponse>({
    endpoint,
    method = "GET",
    data,
    withAuth = true,
    withAttachment = false,
}: Props) => {
    const instance = axios.create({
        baseURL: BASE_URL,
    });

    if (withAuth) {
        const authKey = process.env.NEXT_PUBLIC_AUTH_KEY as string;

        if (authKey) {
            const cookiesStore = await cookies(); // Aguarde a resolução da Promise
            const sessionAuth = cookiesStore.get(authKey);

            if (sessionAuth?.value) {
                instance.defaults.headers.common["Authorization"] = `Bearer ${sessionAuth.value}`;
            }
        }
    }

    if (withAttachment) {
        instance.defaults.headers.common["Content-Type"] = "multipart/form-data";
    }

    try {
        const request = await instance<TypeResponse>(endpoint, {
            method,
            params: method === "GET" ? data : undefined,
            data: method !== "GET" ? data : undefined,
        });

        return {
            data: request.data,
        };
    } catch (error) {
        const e = error as AxiosError<APIError>;
        console.error("API Error:", e.message);

        return {
            error: {
                message: e.response?.data?.detail ?? "Ocorreu um erro inesperado",
            },
        };
    }
};
