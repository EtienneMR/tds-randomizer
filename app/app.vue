<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";

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

const TYPES = [
  {
    label: "Towers",
    value: "tower",
    icon: "i-lucide-sword",
  },
  {
    label: "Maps",
    value: "map",
    icon: "i-lucide-map",
  },
] as const satisfies TabsItem[];

const { equipables, toggleState, toggleGroup } = await useEquipables();

const activeTab = ref<(typeof TYPES)[number]["value"]>("tower");
const selectedTowers = ref<Equipable[]>([]);
const selectedMap = ref<Equipable | null>(null);
const generating = ref(false);
const picked = ref(false);

const equipablesTypes = computed(() => groupArray(equipables.value, "type"));
const tabGroups = computed(() =>
  groupArray(equipablesTypes.value[activeTab.value], "group")
);

function reset() {
  for (const equipable of equipables.value) {
    if (equipable.state == "removed") {
      equipable.state = "default";
    }
  }
  selectedTowers.value = [];
  selectedMap.value = null;
  picked.value = false;
}

function wrapToggle<P extends unknown[]>(f: (...args: P) => void, ...args: P) {
  if (!generating.value) {
    reset();
    f(...args);
  }
}

async function generate() {
  generating.value = true;
  reset();
  picked.value = true;

  const towersByState = groupArray(equipablesTypes.value.tower, "state");
  const mapsByState = groupArray(equipablesTypes.value.map, "state");

  const originalTab = activeTab.value;

  activeTab.value = "tower";
  selectedTowers.value = await pickEquipables(
    towersByState.force,
    towersByState.default,
    5
  );

  activeTab.value = "map";
  selectedMap.value = (
    await pickEquipables(mapsByState.force, mapsByState.default, 1)
  )[0]!;

  activeTab.value = originalTab;
  generating.value = false;
}
</script>

<template>
  <UApp>
    <div
      class="p-6 flex flex-col gap-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen overflow-hidden"
    >
      <h1 class="text-2xl font-bold self-center">TDS randomizer</h1>
      <UTabs :items="TYPES" v-model="activeTab" />

      <Transition class="flex-1" mode="out-in" name="tab">
        <div
          :key="activeTab"
          class="flex flex-wrap gap-4 justify-center content-start"
        >
          <GroupCard
            v-for="(equipables, groupName) in tabGroups"
            :key="groupName"
            :group-name="groupName"
            :equipables="equipables"
            :is-picking="picked"
            @toggleState="(e) => wrapToggle(toggleState, e)"
            @toggleGroup="(n) => wrapToggle(toggleGroup, n)"
          />
        </div>
      </Transition>

      <SelectionInventory
        :selected-towers="selectedTowers"
        :selected-map="selectedMap"
        :generating="generating"
        @generate="generate"
      />
    </div>
  </UApp>
</template>

<style>
.tab-enter-active,
.tab-leave-active {
  transition: opacity 0.5s ease;
}

.tab-enter-from,
.tab-leave-to {
  opacity: 0;
}

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

.ml-5.list-enter-from,
.ml-5.list-leave-to {
  margin-right: calc(-21 * var(--spacing));
}
</style>
