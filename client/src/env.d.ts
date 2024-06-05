interface ImportMetaEnv {
    readonly VITE_BACKEND_URL: string;
    readonly VITE_FRONTEND_URL: string;
    readonly VITE_APP_NAME: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}