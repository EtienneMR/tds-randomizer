<script setup lang="ts">
defineProps<{ equipable: Equipable; showGroup?: boolean }>();
</script>

<template>
  <div
    class="h-14 w-14 select-none hover:scale-105 transition-transform cursor-pointer"
  >
    <UTooltip
      :text="equipable.name + (showGroup ? ' - ' + equipable.group : '')"
      :delay-duration="0"
    >
      <img
        :src="equipable.image"
        :alt="equipable.name + ' image'"
        class="p-1 transition-colors"
        :class="[
          equipable.state == 'force' && 'border-success bg-success/25 border-2',
          equipable.state == 'ban' && 'border-error bg-error/25 border-2',
          equipable.state == 'default' &&
            'border-neutral-500 bg-neutral-500/10 border-1',
          equipable.type == 'tower' && 'rounded-full',
          equipable.type == 'map' && 'rounded-xl',
        ]"
      />
    </UTooltip>
  </div>
</template>
