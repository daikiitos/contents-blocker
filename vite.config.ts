import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx, defineManifest } from "@crxjs/vite-plugin"

const manifest = defineManifest({
  name: "Contents Blocker",
  description: "Block contents",
  version: "0.1",
  manifest_version: 3,
  permissions: ["declarativeNetRequest"],
  host_permissions: ["<all_urls>"],
  options_page: "options.html"
})

// https://vitejs.dev/config/
export default defineConfig({
  // plugins: [react()]
  plugins: [react(), crx({ manifest })]
})
