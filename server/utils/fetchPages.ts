const TOWERS_PAGE_URL = "https://tds.fandom.com/rest.php/v1/page/Towers";
const MAPS_PAGE_URL = "https://tds.fandom.com/rest.php/v1/page/Maps";

interface PageQuery {
  id: number;
  key: string;
  title: string;
  latest: Latest;
  content_model: string;
  license: License;
  source: string;
}

interface Latest {
  id: number;
  timestamp: string;
}

interface License {
  url: string;
  title: string;
}

export default async function fetchPages() {
  const towersPage = await $fetch<PageQuery>(TOWERS_PAGE_URL, {
    responseType: "json",
  });
  const mapsPage = await $fetch<PageQuery>(MAPS_PAGE_URL, {
    responseType: "json",
  });

  return { towersPage, mapsPage };
}
