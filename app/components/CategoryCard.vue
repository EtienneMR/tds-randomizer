<script setup lang="ts">
defineProps<{
  category: string;
  towers: Tower[];
  states: { [name: string]: "force" | "ban" | "default" };
}>();

defineEmits(["toggleState"]);
</script>

<template>
  <div
    class="flex flex-col rounded-xl bg-white dark:bg-gray-900 shadow-md ring-1 ring-gray-200 dark:ring-gray-700 overflow-hidden"
  >
    <div
      class="h-64 flex flex-col flex-wrap flex-1 content-center justify-start p-4 gap-2 bg-gray-50 dark:bg-gray-800"
    >
      <TowerIcon
        v-for="tower in towers"
        :key="tower.name"
        :tower="tower"
        :status="states[tower.name] ?? 'default'"
        @click="$emit('toggleState', tower.name)"
      />
    </div>
    <div
      class="bg-white dark:bg-gray-900 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700"
    >
      {{ category }}
    </div>
  </div>
</template>
