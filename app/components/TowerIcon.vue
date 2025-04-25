<script setup lang="ts">
defineProps<{ tower: Tower; status: "force" | "ban" | "default" }>();
</script>

<template>
  <div class="h-14 w-14 hover:scale-105 transition-transform">
    <UTooltip :text="tower.name" :delay-duration="0">
      <img
        :src="tower.image"
        alt="Tower image"
        class="rounded-full p-1 transition-colors"
        :class="[
          status == 'force' && 'border-success bg-success/25 border-2',
          status == 'ban' && 'border-error bg-error/25 border-2',
          status == 'default' &&
            'border-neutral-500 bg-neutral-500/10 border-1',
        ]"
      />
    </UTooltip>
  </div>
</template>
