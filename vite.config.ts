import {
  defineConfig,
  loadEnv,
  type Plugin,
  type ViteDevServer,
  type PreviewServer,
} from "vite";
import react from "@vitejs/plugin-react";
import { launchMetadata } from "./server/launch-metadata.ts";
import { prerender } from "./server/prerender.ts";
import { formspreeEndpoint } from "./src/signup-config.ts";
import {
  createWaitlistHandler,
  defaultDatabasePath,
} from "./server/waitlist.ts";

function waitlist(): Plugin {
  const configure = (server: ViteDevServer | PreviewServer) => {
    const handler = createWaitlistHandler({
      databasePath: defaultDatabasePath,
    });
    server.middlewares.use((request, response, next) => {
      if (request.url?.split("?")[0] === "/api/signup")
        handler.handle(request, response);
      else next();
    });
    server.httpServer?.once("close", () => handler.close());
  };
  return {
    name: "360-local-waitlist",
    configureServer: configure,
    configurePreviewServer: configure,
  };
}

export default defineConfig(({ mode }) => {
  const {
    SITE_URL,
    VITE_FORMSPREE_ENDPOINT,
    GOOGLE_SITE_VERIFICATION,
    BING_SITE_VERIFICATION,
  } = loadEnv(mode, process.cwd(), [
    "SITE_",
    "VITE_FORMSPREE_",
    "GOOGLE_SITE_",
    "BING_SITE_",
  ]);
  const endpoint = formspreeEndpoint(VITE_FORMSPREE_ENDPOINT);
  if (mode === "pages" && (!SITE_URL || !endpoint)) {
    throw new Error(
      "A Pages build requires SITE_URL and a verified VITE_FORMSPREE_ENDPOINT. Public deployment is on hold until signup is connected.",
    );
  }
  return {
    plugins: [
      react(),
      waitlist(),
      launchMetadata(SITE_URL, {
        google: GOOGLE_SITE_VERIFICATION,
        bing: BING_SITE_VERIFICATION,
      }),
      prerender(mode),
    ],
  };
});
