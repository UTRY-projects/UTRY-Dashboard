import { useEffect, useState } from "react";

const FullscreenLoading = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Verifying session...</p>
    </div>
);

export function SessionValidator({children}: { children: React.ReactNode }) {
    const app = useAppBridge();
    const [isValidating, setIsValidating] = useState(true);
    const {error, setError} = useState<string | null>(null);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const params = new URLSearchParams(window.location.search);
                const shop = params.get('shop');
                const host = params.get('host');
                if (!shop) {
                    throw new Error("The 'shop' parameter is missing from the URL. Cannot validate session.");
                }
                const baseUrl = "https://jennet-sweeping-warthog.ngrok-free.app/"

                const response = await
            } catch (e){
                console.error("Session validation error:", e);
                setError(e instanceof Error ? e.message : "An unknown error occurred.");
                setIsValidating(false);
            }
        }
    }, []);
}