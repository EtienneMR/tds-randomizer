import { Equipable } from "~~/shared/types/types";

const GROUP_REGEX =
  /<span class="mainheader">\s*{{Colour\|?[^|}]*\|([^}]+)}}\s*<\/span>/g;
const FILE_REGEX = /\[\[File:([^\]|]+)\|[^|]*\|link=([^\]]+)\]\]/g;

interface CategoryMatch {
  name: string;
  start: number;
  end: number;
}

export async function extractTowers(rawHtml: string): Promise<Equipable[]> {
  const towers: Equipable[] = [];
  const categories: CategoryMatch[] = [];

  // Extract categories
  let groupMatch: RegExpExecArray | null;
  while ((groupMatch = GROUP_REGEX.exec(rawHtml)) !== null) {
    categories.push({
      name: groupMatch[1].trim(),
      start: groupMatch.index,
      end: groupMatch.index + groupMatch[0].length,
    });
  }

  // Extract towers within each category
  for (let i = 0; i < categories.length; i++) {
    const { name: categoryName, end: categoryEnd } = categories[i];
    if (categoryName === "Removed") continue;

    const nextCategoryStart =
      i + 1 < categories.length ? categories[i + 1].start : rawHtml.length;
    const categorySection = rawHtml.slice(categoryEnd, nextCategoryStart);

    let fileMatch: RegExpExecArray | null;
    while ((fileMatch = FILE_REGEX.exec(categorySection)) !== null) {
      const imageName = fileMatch[1].trim();
      const towerName = fileMatch[2].trim();
      const imageUrl = await fetchImage(imageName);

      towers.push({
        name: towerName,
        image: imageUrl,
        group: categoryName,
        type: "tower",
        state: "default",
      });
    }
  }

  return towers;
}

export async function extractRegularMaps(
  wikiText: string
): Promise<Equipable[]> {
  // 1. Grab the “Regular” section
  const secMatch = wikiText.match(
    /\{\{Header2\|Regular\}\}([\s\S]*?)(?=\{\{Header2\|)/
  );
  if (!secMatch) return [];
  const section = secMatch[1];

  // 2. Split into table‐rows at each "|-\n" (removing any empty fragments)
  const rows = section
    .split(/\|\-\s*\n/)
    .map((r) => r.trim())
    .filter((r) => r.length > 0);
  console.log(rows);

  const maps: Equipable[] = [];

  // 3. Process each group of 4 rows: [images, names, difficulty, enemies]
  for (let i = 0; i < rows.length; i += 4) {
    const imgRow = rows[i] || "";
    const nameRow = rows[i + 1] || "";
    const diffRow = rows[i + 2] || "";

    // 4. Extract images from imgRow
    const imageRe = /\[\[File:([^|\]]+)\|[^|\]]+\|link=[^\]]+\]\]/g;
    const imageFiles: string[] = [];
    let m: RegExpExecArray | null;
    while ((m = imageRe.exec(imgRow))) {
      imageFiles.push(m[1]);
    }

    // 5. Extract names from nameRow
    const nameRe = /\[\[([^\]\|]+)\]\]/g;
    const names: string[] = [];
    while ((m = nameRe.exec(nameRow))) {
      names.push(m[1]);
    }

    // 6. Extract difficulties from diffRow
    const diffRe = /\{\{Colour\|(.+?)\}\}/g;
    const diffs: string[] = [];
    while ((m = diffRe.exec(diffRow))) {
      diffs.push(m[1]);
    }

    // 7. Zip this group into our result array
    const count = Math.min(names.length, imageFiles.length, diffs.length);
    for (let j = 0; j < count; j++) {
      maps.push({
        name: names[j],
        image: await fetchImage(imageFiles[j]),
        group: diffs[j],
        type: "map",
        state: "default",
      });
    }
  }

  return maps;
}
