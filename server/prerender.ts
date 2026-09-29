import { createServer, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

// Render the existing homepage at build time. No runtime server, browser,
// private waitlist handler or separate crawler-only copy is involved.
export function prerender(mode: string): Plugin {
  return {
    name: "360-prerender",
    apply: "build",
    async transformIndexHtml(html) {
      const server = await createServer({
        configFile: false,
        mode,
        plugins: [react()],
        appType: "custom",
        server: { middlewareMode: true, hmr: false, watch: null },
      });
      try {
        const { render } = await server.ssrLoadModule("/src/entry-server.tsx");
        return html.replace(
          '<div id="root"></div>',
          () => `<div id="root">${render()}</div>`,
        );
      } finally {
        await server.close();
      }
    },
  };
}
