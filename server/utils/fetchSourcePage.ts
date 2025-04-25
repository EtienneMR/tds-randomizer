const SOURCE_PAGE_URL = "https://tds.fandom.com/rest.php/v1/page/Towers";

interface WikiPageQuery {
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

export default async function fetchSourcePage() {
  const page = await $fetch<WikiPageQuery>(SOURCE_PAGE_URL, {
    responseType: "json",
  });

  return page.source;
}
