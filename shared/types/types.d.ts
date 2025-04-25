export interface Tower {
  name: string;
  image: string;
}

export type TowersByCategory = Record<string, Tower[]>;
