// sw.ts
import { ServiceWorkerMLCEngineHandler } from "@mlc-ai/web-llm";

self.addEventListener("activate", () => {
    const handler = new ServiceWorkerMLCEngineHandler();
    console.log("Service Worker activated!");
});