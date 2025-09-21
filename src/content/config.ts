import { defineCollection, z } from "astro:content";

// Define schema for products
const products = defineCollection({
  type: "content", // products will be stored as Markdown/JSON content
  schema: z.object({
    name: z.string(),
    price: z.number(),
    description: z.string(),
    image: z.string(), // path to uploaded image
  }),
});

export const collections = {
  products,
};
