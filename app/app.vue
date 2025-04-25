<script setup lang="ts">
useSeoMeta({
  title: "TDS randomizer",
  description: "Generate a random loadout for TDS",
  ogTitle: "TDS randomizer",
  ogDescription: "Generate a random loadout for TDS",
  ogUrl: "https://tds.etiennemr.fr",
  twitterTitle: "TDS randomizer",
  twitterDescription: "Generate a random loadout for TDS",
  twitterCard: "summary",
});

useHead({
  htmlAttrs: {
    lang: "en",
  },
  link: [
    {
      rel: "icon",
      type: "image/png",
      href: "https://share.etiennemr.fr/f/icons/icon.png",
    },
  ],
});

const INVENTORY_SIZE = 5;

const { data: categories } = await useFetch<TowersByCategory>(
  "/api/categories"
);

const states = ref<Record<string, "force" | "ban" | "default">>({});

function toggleState(name: string): void {
  const oldValue = states.value[name];
  const newState =
    oldValue === "ban" ? "force" : oldValue === "force" ? "default" : "ban";
  states.value[name] = newState;

  if (newState === "default") localStorage.removeItem(name);
  else localStorage.setItem(name, newState);
}

const towerList = computed<Tower[]>(() =>
  Object.values(categories.value ?? {}).flat()
);

const forced = computed<Tower[]>(() =>
  towerList.value.filter((t) => states.value[t.name] === "force")
);

const selectables = computed<Tower[]>(() =>
  towerList.value.filter((t) => states.value[t.name] === "default")
);

const selected = ref<Tower[]>([]);

function generate(): void {
  const final = [...forced.value];
  const possible = [...selectables.value];
  const nb = INVENTORY_SIZE - final.length;

  for (let i = 0; i < nb; i++) {
    if (possible.length) {
      const index = Math.floor(Math.random() * possible.length);
      final.push(...possible.splice(index, 1));
    }
  }
  selected.value = final;
}

watch([forced, selectables], () => {
  selected.value = [];
});

onMounted(() => {
  for (const tower of towerList.value) {
    states.value[tower.name] =
      (localStorage.getItem(tower.name) as "force" | "ban" | "default") ??
      "default";
  }
});
</script>

<template>
  <UApp>
    <div
      class="p-6 flex flex-col gap-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen overflow-hidden"
    >
      <h1 class="text-2xl font-bold self-center">TDS randomizer</h1>
      <div class="flex flex-wrap gap-4 justify-center content-start flex-1">
        <CategoryCard
          v-for="(towers, category) in categories"
          :key="category"
          :category="category"
          :towers="towers"
          :states="states"
          @toggleState="toggleState"
        />
      </div>

      <TransitionGroup
        name="list"
        tag="div"
        class="w-full h-14 flex gap-2 justify-center items-center"
      >
        <TowerIcon
          v-for="tower in selected"
          :key="tower.name"
          :tower="tower"
          :status="states[tower.name] ?? 'default'"
        />
        <UButton
          key="generate-btn"
          variant="outline"
          icon="i-lucide-dices"
          size="xl"
          @click="generate"
        />
      </TransitionGroup>
    </div>
  </UApp>
</template>

<style>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
  margin-right: calc(-16 * var(--spacing));
}
</style>
