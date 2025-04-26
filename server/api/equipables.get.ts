export default defineCachedEventHandler(
  async () => {
    const { towersPage, mapsPage } = await fetchPages();

    return ([] as Equipable[])
      .concat(await extractTowers(towersPage.source))
      .concat(await extractRegularMaps(mapsPage.source));
  },
  {
    name: "equipables",
    getKey: () => "_",
    maxAge: 60 * 60 * 24,
    swr: true,
  }
);
