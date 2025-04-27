<script setup lang="ts">
defineProps<{
  groupName: string;
  equipables: Equipable[];
  isPicking: boolean;
}>();

defineEmits<{
  (e: "toggleState", equipable: Equipable): void;
  (e: "toggleGroup", groupname: string): void;
}>();
</script>

<template>
  <div
    class="flex flex-col rounded-xl bg-white dark:bg-gray-900 shadow-md ring-1 ring-gray-200 dark:ring-gray-700 overflow-hidden"
  >
    <div
      class="h-64 flex flex-col flex-wrap flex-1 content-center justify-start p-4 gap-2 bg-gray-50 dark:bg-gray-800"
    >
      <EquipableIcon
        v-for="equipable in equipables"
        :key="equipable.name"
        :equipable="equipable"
        :is-picking="isPicking"
        @click="$emit('toggleState', equipable)"
      />
    </div>
    <div
      class="bg-white dark:bg-gray-900 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 select-none hover:scale-110 transition-transform cursor-pointer"
      @click="$emit('toggleGroup', groupName)"
    >
      {{ groupName }}
    </div>
  </div>
</template>
