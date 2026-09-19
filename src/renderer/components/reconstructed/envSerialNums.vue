<script setup>
const props = defineProps(['serialNums', 'content'])
</script>

<template>
  <div class="tw-flex tw-items-center">
    <span class="serialNums-wrapper">
      {{ props.content ? props.content : props.serialNums.join(' , ') }}
    </span>
  </div>
</template>

<style scoped>
.serialNums-wrapper {
  display: flex;
  gap: 8px;
  flex-wrap: nowrap;
}
</style>
