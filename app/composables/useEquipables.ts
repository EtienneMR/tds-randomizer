const STATE_TOGGLE = ["default", "ban", "force"] as const;
const STORAGE_PREFIX = "tds_";

export default async function useEquipables() {
  const equipables = useState<Equipable[]>("equipables");

  function setState(
    equipable: Equipable,
    state: (typeof STATE_TOGGLE)[number]
  ) {
    equipable.state = state;

    if (state === "default") {
      localStorage.removeItem(STORAGE_PREFIX + equipable.name);
    } else {
      localStorage.setItem(STORAGE_PREFIX + equipable.name, state);
    }
  }

  function nextState(state: string) {
    const currentIndex = (STATE_TOGGLE as readonly string[]).indexOf(state);
    return STATE_TOGGLE[(currentIndex + 1) % STATE_TOGGLE.length]!;
  }

  function toggleState(equipable: Equipable): void {
    setState(equipable, nextState(equipable.state));
  }

  function toggleGroup(groupName: string) {
    const group = equipables.value.filter((e) => e.group == groupName);

    if (group.length) {
      const state = nextState(group[0]!.state);

      for (const equipable of group) {
        setState(equipable, state);
      }
    }
  }

  onMounted(() => {
    for (const equipable of equipables.value) {
      equipable.state =
        (localStorage.getItem(
          STORAGE_PREFIX + equipable.name
        ) as (typeof STATE_TOGGLE)[number]) ?? "default";
    }
  });

  await callOnce(async () => {
    equipables.value = await $fetch<Equipable[]>("/api/equipables");
  });

  return { equipables, toggleState, toggleGroup };
}
