import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "THE AI JUNGLE | LeadSphere Studio",
    short_name: "LeadSphere",
    description: "Data, Digital & AI Transformation Studio by Dr. Amit Khandelwal",
    start_url: "/",
    id: "/",
    scope: "/",
    display: "standalone",
    background_color: "#07100D",
    theme_color: "#07100D",
    orientation: "any",
    categories: ["books", "entertainment", "education", "business"],
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Discover",
        short_name: "Discover",
        description: "Browse the curated collection of AI Transformation resources",
        url: "/discover",
        icons: [{ src: "/icons/icon-192x192.png", sizes: "192x192" }],
      },
      {
        name: "Comics Vault",
        short_name: "Comics",
        description: "Read visual comic sheets and audit stories",
        url: "/comics",
        icons: [{ src: "/icons/icon-192x192.png", sizes: "192x192" }],
      },
      {
        name: "Podcasts",
        short_name: "Podcasts",
        description: "Watch and listen to the AI Jungle Studio series",
        url: "/podcasts",
        icons: [{ src: "/icons/icon-192x192.png", sizes: "192x192" }],
      },
      {
        name: "My Library",
        short_name: "Library",
        description: "View saved bookmarks, orders, and purchased books",
        url: "/library",
        icons: [{ src: "/icons/icon-192x192.png", sizes: "192x192" }],
      },
    ],
  };
}

