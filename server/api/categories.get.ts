export default defineCachedEventHandler(
  async () => {
    const source = await fetchSourcePage();

    const categories = extractTowersByCategory(source);

    return categories;
  },
  {
    name: "categories",
    maxAge: 60 * 60 * 24,
    swr: true,
  }
);
