import { defineConfig, loadEnv} from "vite";
import react from "@vitejs/plugin-react";


export default defineConfig(({mode})=>{
    const env = loadEnv(mode, process.cwd(), '');
        return {
            define:{
                'process.env': env
            },
                base: "/",
                plugins: [react()],
                preview: {
                port: 8082,
                strictPort: true,
            },
            server: {
                port: 8082,
                strictPort: true,
                host: true,
            }
        }
});