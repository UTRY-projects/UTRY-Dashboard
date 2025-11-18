import { useAppBridge } from '@shopify/app-bridge-react';
// import { getSessionToken } from '@shopify/app-bridge-utils';
import { useMemo } from 'react';

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type Query = Record<string, unknown>;

const baseRaw = import.meta.env.VITE_API_BASE_URL || "";

type FetchOpts = {
    signal?: AbortSignal;
    credentials?: RequestCredentials;
    headers?: Record<string, string>;
};

type QueryParams = Record<string, string | number | boolean | null | undefined>;

type ApiRequestInit = RequestInit & {
    method?: HttpMethod;
    params?: QueryParams;
};

const BASE_URL = String(baseRaw).replace(/\/+$/, "");

function trimSlashes(s: string) {
    return s.replace(/\/+$/, "");
}

function joinUrl(base: string, path: string) {
    if (!base) {
        return path;
    }

    const b = trimSlashes(base);
    const p = path.replace(/^\/+/, "");
    return `${b}/${p}`;
}

function toQueryString(params?: Query) {
    if (!params) return "";
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
        if (v === undefined || v === null) continue;
        if (v instanceof Date) {
            q.set(k, v.toISOString());
        } else {
            q.set(k, String(v));
        }
    }
    const s = q.toString();
    return s ? `?${s}` : "";
}

async function parseJsonSafe(res: Response): Promise<unknown> {
    const text = await res.text();
    if(!text){
        return null;
    }

    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
        try {
            return JSON.parse(text);
        } catch (e) {
            console.error("Failed to parse JSON response, returning raw text.", { text, error: e });
            // If parsing fails despite the content-type, fall back to returning the raw text.
            return text;
        }
    }
    return text;
}

function getMessageFromBody(body: unknown): string | undefined {
    if (typeof body === "object" && body !== null) {
        const msg = (body as Record<string, unknown>).message;
        if (typeof msg === "string") return msg;
    }
    return undefined;
}

async function handleResponse<T>(res: Response, urlForError: string): Promise<T> {
    const body = await parseJsonSafe(res);
    if (!res.ok) {
        const msg = getMessageFromBody(body) ?? JSON.stringify(body);
        throw new Error(`${res.status} ${res.statusText} - ${urlForError} - ${msg}`);
    }
    return body as T;
}

async function get<T = unknown>(path: string, query?: Query, init?: RequestInit): Promise<T> {
    const url = joinUrl(BASE_URL, path) + toQueryString(query);
    const res = await fetch(url, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "ngrok-skip-browser-warning": "true",
            ...(init?.headers ?? {}) },
        cache: "no-store",
        ...init,
    });
    return handleResponse<T>(res, url);
}

async function post<T = unknown>(path: string, body?: unknown, init?: RequestInit): Promise<T> {
    const url = joinUrl(BASE_URL, path);
    const res = await fetch(url, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
            ...(init?.headers ?? {}),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
        ...init,
    });
    return handleResponse<T>(res, url);
}

export function useAuthenticatedApi() {
    const app = useAppBridge();

    const authenticatedApi = useMemo(() => {
        const getAuthHeaders = async () => {
            const token = await app.idToken();
            return { 'Authorization': `Bearer ${token}` };
        };

        return {
            get: async <T = unknown>(path: string, query?: Query, init?: RequestInit): Promise<T> => {
                const authHeaders = await getAuthHeaders();
                const newInit = {
                    ...init,
                    headers: {
                        ...init?.headers,
                        ...authHeaders,
                    },
                };
                return get<T>(path, query, newInit);
            },
            post: async <T = unknown>(path: string, body?: unknown, init?: RequestInit): Promise<T> => {
                const authHeaders = await getAuthHeaders();
                const newInit = {
                    ...init,
                    headers: {
                        ...init?.headers,
                        ...authHeaders,
                    },
                };
                return post<T>(path, body, newInit);
            },
        };
    }, [app]);

    return authenticatedApi;
}

export const api = { get, post };