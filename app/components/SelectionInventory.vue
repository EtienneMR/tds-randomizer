<script setup lang="ts">
defineProps<{
  selectedTowers: Equipable[];
  selectedMap: Equipable | null;
  generating: boolean;
}>();

defineEmits<{
  (e: "generate"): void;
}>();
</script>

<template>
  <TransitionGroup
    name="list"
    tag="div"
    class="w-full h-16 flex gap-2 justify-center items-center"
  >
    <EquipableIcon
      v-for="equipable in selectedTowers"
      :key="equipable.name"
      :equipable="equipable"
      show-group
      is-picking
    />
    <EquipableIcon
      v-if="selectedMap"
      :key="selectedMap.name"
      :equipable="selectedMap"
      :class="selectedTowers.length && 'ml-5'"
      show-group
      is-picking
    />
    <div key="generate-btn">
      <UButton
        variant="outline"
        icon="i-lucide-dices"
        size="xl"
        class="cursor-pointer"
        :class="(selectedMap || selectedTowers.length) && 'ml-5'"
        :loading="generating"
        @click="$emit('generate')"
      />
    </div>
  </TransitionGroup>
</template>
