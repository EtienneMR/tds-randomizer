<script setup lang="ts">
import CategoryCard from "./components/CategoryCard.vue";
import TowerIcon from "./components/TowerIcon.vue";

const NUMBER = 5;

const { data: categories } = await useFetch<TowersByCategory>(
  "/api/categories"
);

const states = ref<{ [name: string]: "force" | "ban" | "default" }>({});

function toggleState(name: string) {
  const oldValue = states.value[name];
  const newState =
    oldValue == "ban" ? "force" : oldValue == "force" ? "default" : "ban";
  states.value[name] = newState;

  if (newState == "default") localStorage.removeItem(name);
  else localStorage.setItem(name, newState);
}

const towerList = computed(() => Object.values(categories.value).flat(1));

const forced = computed(() =>
  towerList.value.filter((t) => states.value[t.name] == "force")
);

const selectables = computed(() =>
  towerList.value.filter((t) => states.value[t.name] == "default")
);

const selected = ref<Tower[]>([]);

function generate() {
  const final = [...forced.value];
  const possible = [...selectables.value];
  const nb = NUMBER - final.length;

  for (let i = 0; i < nb; i++)
    if (possible.length) {
      const index = Math.floor(Math.random() * possible.length);
      final.push(...possible.splice(index, 1));
    }
  selected.value = final;
}

watch([forced, selectables], () => (selected.value = []));

onMounted(() => {
  for (const tower of towerList.value) {
    states.value[tower.name] = localStorage.getItem(tower.name) ?? "default";
  }
});
</script>

<template>
  <UApp>
    <div
      class="p-6 flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen"
    >
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
      <div class="w-full flex gap-2 justify-center items-center">
        <TowerIcon
          v-for="tower in selected"
          :key="tower.name"
          :tower="tower"
          :status="states[tower.name] ?? 'default'"
          @click="toggleState(tower.name)"
        />
        <UButton
          key="generate-btn"
          variant="outline"
          icon="i-lucide-dices"
          size="xl"
          @click="generate"
        />
      </div>
    </div>
  </UApp>
</template>
