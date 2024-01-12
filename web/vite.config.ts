import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  server: { port: 3000 },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@components": `${path.resolve(__dirname, "./src/components/")}`,
      "@reusable": `${path.resolve(__dirname, "./src/components/reusable/")}`,
      "@appComps": `${path.resolve(
        __dirname,
        "./src/components/reusable/appComps/"
      )}`,
      "@gqlOps": `${path.resolve(__dirname, "./src/graphql/operations/")}`,
      "@redux": `${path.resolve(__dirname, "./src/redux/")}`,
      "@rSlices": `${path.resolve(__dirname, "./src/redux/slices/")}`,
      "@utils": `${path.resolve(__dirname, "./src/utils/")}`,
      "@hooks": `${path.resolve(__dirname, "./src/utils/hooks/")}`,
      "@constants": `${path.resolve(__dirname, "./src/constants/")}`,
      "@routes": `${path.resolve(__dirname, "./src/routes/")}`,
      "@config": `${path.resolve(__dirname, "./src/config/")}`,
      "@contractor": `${path.resolve(
        __dirname,
        "./src/components/contractor/"
      )}`,
      "@user": `${path.resolve(__dirname, "./src/components/user/")}`,
      "@advs": `${path.resolve(__dirname, "./src/components/advs/")}`,
      "@jobs": `${path.resolve(__dirname, "./src/components/jobs/")}`,
      "@types": `${path.resolve(__dirname, "./src/types/")}`,
      "@icons": `${path.resolve(__dirname, "./src/assets/icons/")}`,
      "@chat": `${path.resolve(__dirname, "./src/components/chat/")}`,
    },
  },
});
