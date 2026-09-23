<script setup>
import { nextTick, onMounted, onUnmounted, ref } from 'vue'

const visible = ref(false)
const root = ref(null)
let observer

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return

      nextTick(() => {
        visible.value = true
      })

      observer.unobserve(entry.target)
      observer.disconnect()
    },
    {
      rootMargin: '100px 0px',
    },
  )

  if (root.value) observer.observe(root.value)
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <div ref="root">
    <div v-if="visible">
      <slot />
    </div>
    <div v-else class="skeleton-placeholder">
      <slot name="placeholder" />
    </div>
  </div>
</template>
