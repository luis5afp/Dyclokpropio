<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean],
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

function handleChange(value) {
  emit('change', value)
}
</script>

<template>
  <el-radio-group
    v-model="model"
    class="custom-el-radio-group"
    v-bind="$attrs"
    text-color="var(--primary-color)"
    fill="rgba(255, 255, 255, 0)"
    @change="handleChange"
  >
    <slot />
  </el-radio-group>
</template>

<style scoped>
.custom-el-radio-group :deep(.el-radio-button.is-active) {
  position: relative;
  z-index: 1;
}

.custom-el-radio-group :deep(.el-radio-button.is-active .el-radio-button__inner) {
  border-color: var(--primary-color) !important;
}

.custom-el-radio-group :deep(.el-radio-button:not(:first-child) .el-radio-button__inner) {
  margin-left: -1px;
  border-left: 1px solid var(--dialog-border-color);
}

.custom-el-radio-group
  :deep(.el-radio-button.is-active:not(:first-child) .el-radio-button__inner) {
  border-left-color: var(--primary-color) !important;
  box-shadow: none !important;
}
</style>
