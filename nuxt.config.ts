// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  future: {
    compatibilityVersion: 4,
  },

  css: ["~/assets/css/main.css"],

  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxt/eslint"],
});
