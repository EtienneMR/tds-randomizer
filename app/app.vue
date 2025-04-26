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

const equipablesTypes = computed(() => groupArray(equipables.value, "type"));
const tabGroups = computed(() =>
  groupArray(equipablesTypes.value[activeTab.value], "group")
);

function generate(): void {
  const towersByState = groupArray(equipablesTypes.value.tower, "state");

  const finalMaps = towersByState.force ?? [];
  const towersAvaiable = towersByState.default ?? [];
  const towsrsMissing = 5 - finalMaps.length;

  for (let i = 0; i < towsrsMissing; i++) {
    if (towersAvaiable.length) {
      const index = Math.floor(Math.random() * towersAvaiable.length);
      finalMaps.push(...towersAvaiable.splice(index, 1));
    }
  }
  selectedTowers.value = finalMaps;

  const mapsByState = groupArray(equipablesTypes.value.map, "state");

  if (mapsByState.force?.length) {
    selectedMap.value = mapsByState.force[0]!;
  } else if (mapsByState.default?.length) {
    selectedMap.value =
      mapsByState.default[
        Math.floor(Math.random() * mapsByState.default.length)
      ]!;
  } else {
    selectedMap.value = null;
  }
}

watch(
  equipables,
  () => {
    selectedTowers.value = [];
    selectedMap.value = null;
  },
  { deep: true }
);
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
            @toggleState="toggleState"
            @toggleGroup="toggleGroup"
          />
        </div>
      </Transition>

      <TransitionGroup
        name="list"
        tag="div"
        class="w-full h-14 flex gap-2 justify-center items-center"
      >
        <EquipableIcon
          v-for="equipable in selectedTowers"
          :key="equipable.name"
          :equipable="equipable"
          show-group
        />
        <EquipableIcon
          v-if="selectedMap"
          :key="selectedMap.name"
          :equipable="selectedMap"
          :class="selectedTowers.length && 'ml-5'"
          show-group
        />
        <div key="generate-btn">
          <UButton
            variant="outline"
            icon="i-lucide-dices"
            size="xl"
            class="cursor-pointer"
            :class="selectedMap && 'ml-5'"
            @click="generate"
          />
        </div>
      </TransitionGroup>
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
