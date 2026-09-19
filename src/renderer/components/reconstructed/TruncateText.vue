<script setup>
import { computed, nextTick, onMounted, onUnmounted, onUpdated, ref } from 'vue'

const props = defineProps({
  lineNumber: {
    default: 2,
  },
  content: {
    default: '',
  },
})

const lineClampClass = computed(
  () =>
    ({
      1: 'tw-line-clamp-1',
      2: 'tw-line-clamp-2',
      3: 'tw-line-clamp-3',
      4: 'tw-line-clamp-4',
      5: 'tw-line-clamp-5',
    })[props.lineNumber] || '',
)

const textRef = ref()
const isOverflow = ref(false)

let resizeObserver = null
let animationFrame = 0

function checkOverflow() {
  if (animationFrame) cancelAnimationFrame(animationFrame)

  animationFrame = requestAnimationFrame(() => {
    animationFrame = 0

    ;(async () => {
      await nextTick()

      const element = textRef.value
      if (!element) return

      const overflow =
        element.scrollWidth > element.clientWidth ||
        element.scrollHeight > element.clientHeight

      if (isOverflow.value !== overflow) {
        isOverflow.value = overflow
      }
    })()
  })
}

onMounted(() => {
  checkOverflow()

  if (window.ResizeObserver && textRef.value) {
    resizeObserver = new ResizeObserver(() => {
      checkOverflow()
    })
    resizeObserver.observe(textRef.value)
  }

  window.addEventListener('resize', checkOverflow)
})

onUpdated(() => {
  checkOverflow()
})

onUnmounted(() => {
  if (animationFrame) cancelAnimationFrame(animationFrame)
  resizeObserver?.disconnect()
  window.removeEventListener('resize', checkOverflow)
})
</script>

<template>
  <div class="tw-w-full tw-min-w-0">
    <el-tooltip
      :disabled="!isOverflow"
      effect="dark"
      placement="top"
      popper-class="!tw-max-w-[300px]"
      v-bind="$attrs"
    >
      <template #content>
        <slot name="default">
          <div class="tw-max-w-[350px]">
            <div
              class="tw-text-[var(--text-color-base)] tw-text-[13px] tw-whitespace-pre-line"
            >
              {{ props.content }}
            </div>
          </div>
        </slot>
      </template>

      <div ref="textRef" :class="lineClampClass">
        <slot name="default">
          {{ props.content }}
        </slot>
      </div>
    </el-tooltip>
  </div>
</template>
