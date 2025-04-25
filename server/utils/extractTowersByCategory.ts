export default async function extractTowersByCategory(raw: string) {
  const byCat: TowersByCategory = {};

  const catRe =
    /<span class="mainheader">\s*{{Colour\|?[^|}]*\|([^}]+)}}\s*<\/span>/g;
  interface CatMatch {
    name: string;
    start: number;
    end: number;
  }
  const cats: CatMatch[] = [];
  let m: RegExpExecArray | null;
  while ((m = catRe.exec(raw)) !== null) {
    cats.push({
      name: m[1].trim(),
      start: m.index,
      end: m.index + m[0].length,
    });
  }

  const fileRe = /\[\[File:([^\]|]+)\|[^|]*\|link=([^\]]+)\]\]/g;
  for (let i = 0; i < cats.length; i++) {
    const { name: catName, end } = cats[i];
    if (catName == "Removed") continue;
    const nextStart = i + 1 < cats.length ? cats[i + 1].start : raw.length;
    const section = raw.slice(end, nextStart);

    const towers: Tower[] = [];
    let f: RegExpExecArray | null;
    while ((f = fileRe.exec(section)) !== null) {
      const image = f[1].trim();
      const tower = f[2].trim();
      const imageUrl = await fetchImage(image);
      towers.push({ name: tower, image: imageUrl });
    }

    if (towers.length) {
      byCat[catName] = towers;
    }
  }

  return byCat;
}
