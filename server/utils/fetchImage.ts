const BASE_IMAGE_URL = "https://tds.fandom.com/rest.php/v1/file/File:";

interface ImageQuery {
  title: string;
  file_description_url: string;
  latest: Latest;
  preferred: Original;
  original: Original;
  thumbnail: Original;
}

interface Latest {
  timestamp: string;
  user: User;
}

interface User {
  id: number;
  name: string;
}

interface Original {
  mediatype: string;
  size: number | null;
  width: number;
  height: number;
  duration: null;
  url: string;
}

export default async function fetchImage(name: string) {
  const metadata = await $fetch<ImageQuery>(BASE_IMAGE_URL + name, {
    responseType: "json",
  });

  return metadata.thumbnail.url.split("/revision/")[0];
}
