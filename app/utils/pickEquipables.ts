const PICK_TOTAL_TIME = 4000;
const END_DEPLAY_TIME = 1000;

export async function pickEquipables(
  force: Equipable[] | undefined,
  avaiable: Equipable[] | undefined,
  total: number
) {
  const missing = total - (force ? force.length : 0);
  const copy = avaiable ? avaiable.concat([]) : [];

  const delay = (PICK_TOTAL_TIME - END_DEPLAY_TIME) / (copy.length - missing);

  while (copy.length > missing && copy.length > 0) {
    const index = Math.floor(Math.random() * copy.length);
    const toRemove = copy.splice(index, 1)[0]!;
    toRemove.state = "removed";
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  await new Promise((resolve) => setTimeout(resolve, END_DEPLAY_TIME));

  return copy.concat(force ?? []);
}
