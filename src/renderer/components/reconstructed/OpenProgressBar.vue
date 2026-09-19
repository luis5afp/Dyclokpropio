<script setup>
import { computed } from 'vue'

const props = defineProps({
  stepIndex: {},
  totalSteps: {},
  tooltipText: {
    default: '',
  },
})

const activeBlocks = computed(() => {
  if (props.totalSteps <= 0) return 0
  const progress = (props.stepIndex + 1) / props.totalSteps
  return Math.ceil(5 * progress)
})
</script>

<template>
  <el-tooltip
    :content="props.tooltipText"
    placement="top"
    :show-after="300"
    :disabled="!props.tooltipText"
  >
    <div class="open-progress-bar">
      <span
        v-for="block in 5"
        :key="block"
        class="progress-block"
        :class="{ 'progress-block--active': block <= activeBlocks }"
      />
    </div>
  </el-tooltip>
</template>

<style scoped>
.open-progress-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  width: 100%;
  padding: 8px 0;
  cursor: pointer;
}

.progress-block {
  width: 20px;
  height: 6px;
  border-radius: 999px;
  background-color: var(--border-color-light1);
  transition: background-color 0.3s ease;
}

.progress-block--active {
  background-color: #faa63a;
}
</style>
