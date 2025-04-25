export default defineEventHandler(async (event) => {
  const source = await fetchSourcePage();

  const categories = extractTowersByCategory(source);

  return categories;
});
