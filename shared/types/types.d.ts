export interface Equipable {
  name: string;
  image: string;
  group: string;
  type: "tower" | "map";
  state: "force" | "ban" | "default";
}
