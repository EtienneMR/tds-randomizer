<script setup lang="ts">
const { equipable, showGroup, isPicking } = defineProps<{
  equipable: Equipable;
  showGroup?: boolean;
  isPicking: boolean;
}>();

const tooltipText = computed(() =>
  showGroup ? `${equipable.name} - ${equipable.group}` : equipable.name
);

const imgClasses = computed(() => [
  "p-1",
  "transition-all",
  equipable.state === "force" && "border-primary bg-primary/25 border-2",
  equipable.state === "ban" && "border-error bg-error/25 border-2",
  equipable.state === "default" &&
    (isPicking
      ? "border-secondary bg-secondary/10 border-1"
      : "border-neutral-500 bg-neutral-500/10 border-1"),
  (equipable.state === "ban" || equipable.state === "removed") &&
    isPicking &&
    "opacity-25",
  equipable.type === "tower" && "rounded-full",
  equipable.type === "map" && "rounded-xl",
]);
</script>

<template>
  <div
    class="h-16 w-16 select-none hover:scale-105 transition-transform cursor-pointer"
  >
    <UTooltip :text="tooltipText" :delay-duration="0">
      <img
        :src="equipable.image"
        :alt="`${equipable.name} image`"
        :class="imgClasses"
      />
    </UTooltip>
  </div>
</template>
