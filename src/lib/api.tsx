import { useAppBridge } from '@shopify/app-bridge-react';
import { useMemo } from 'react';

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type Query = Record<string, unknown>;


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
const AZURE_API_URL = "https://jennet-sweeping-warthog.ngrok-free.app";
// "jennet-sweeping-warthog.ngrok-free.app", "utry-dev-api.mangopond-e2a8cd3b.northeurope.azurecontainerapps.io
const baseRaw = AZURE_API_URL;
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

export class AuthError extends Error {
    constructor(public shop: string) {
        super("Authentication required");
        this.name = "AuthError";
    }
}

async function handleResponse<T>(res: Response, urlForError: string): Promise<T> {
    const body = await parseJsonSafe(res);

    if (!res.ok) {
        if (res.status === 401) {
            console.warn("[Auth] 401 Detected. Throwing AuthError to trigger redirect...");
            const params = new URLSearchParams(window.location.search);
            const shop = params.get("shop");

            if (shop) {
                // Throw a specific error that the React Component can catch
                throw new AuthError(shop);
            }
        }
        const msg = getMessageFromBody(body) ?? JSON.stringify(body);
        throw new Error(`${res.status} ${res.statusText} - ${urlForError} - ${msg}`);
    }
    return body as T;
}

async function get<T = unknown>(path: string, query?: Record<string, unknown>, init?: RequestInit): Promise<T> {
    const url = joinUrl(BASE_URL, path) + toQueryString(query);

    console.log("[API DEBUG] Sending Headers:", init?.headers);

    const combinedHeaders = {
        "Accept": "application/json",
        "ngrok-skip-browser-warning": "true", // This bypasses the HTML warning page
        ...(init?.headers ?? {})
    };

    const res = await fetch(url, {
        ...init,
        method: "GET",
        headers: combinedHeaders,
        cache: "no-store",
    });

    return handleResponse<T>(res, url);
}

async function post<T = unknown>(path: string, body?: unknown, init?: RequestInit): Promise<T> {
    const url = joinUrl(BASE_URL, path);

    const combinedHeaders = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
        ...(init?.headers ?? {}),
    };

    const res = await fetch(url, {
        ...init,
        method: "POST",
        headers: combinedHeaders,
        body: body === undefined ? undefined : JSON.stringify(body),
    });
    return handleResponse<T>(res, url);
}

async function del<T = unknown>(path: string, query?: Record<string, unknown>, init?: RequestInit): Promise<T> {
    const url = joinUrl(BASE_URL, path) + toQueryString(query);

    const combinedHeaders = {
        "Accept": "application/json",
        "ngrok-skip-browser-warning": "true",
        ...(init?.headers ?? {})
    };

    const res = await fetch(url, {
        ...init,
        method: "DELETE",
        headers: combinedHeaders,
    });

    return handleResponse<T>(res, url);
}

export function useAuthenticatedApi() {
    // In App Bridge 4, this returns the 'shopify' global instance
    const shopify = useAppBridge();

    const authenticatedApi = useMemo(() => {
        const getAuthHeaders = async () => {
            console.log("[Auth] Requesting session token..."); // LOG 1
            try {
                const token = await shopify.idToken();

                if (!token) {
                    console.error("[Auth] Token is null or empty!");
                    throw new Error("Failed to generate token");
                }

                console.log("[Auth] Token received!", token.substring(0, 10) + "..."); // LOG 2
                return { 'Authorization': `Bearer ${token}` };
            } catch (error) {
                console.error("[Auth] Failed to get token:", error); // LOG 3
                throw error;
            }
        };

        return {
            get: async <T = unknown>(path: string, query?: Record<string, unknown>, init?: RequestInit): Promise<T> => {
                console.log(`[API] GET Request to ${path}`); // LOG 4
                console.log(window.location.search);
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
            delete: async <T = unknown>(path: string, query?: Record<string, unknown>, init?: RequestInit): Promise<T> => {
                const authHeaders = await getAuthHeaders();
                const newInit = {
                    ...init,
                    headers: {
                        ...init?.headers,
                        ...authHeaders,
                    },
                };
                return del<T>(path, query, newInit);
            },
        };
    }, [shopify]);

    return authenticatedApi;
}
export const api = { get, post, delete: del };