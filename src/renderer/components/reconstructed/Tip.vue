<script setup>
import { useSlots } from 'vue'

const props = defineProps({
  text: {},
})

const slots = useSlots()
</script>

<template>
  <el-tooltip v-if="props.text || slots.content" placement="top">
    <template #content>
      <slot name="content">
        <div class="tw-max-w-[350px]">
          <div
            class="tw-text-[var(--tip-text-color)] tw-text-[13px] tw-whitespace-pre-line"
          >
            {{ props.text }}
          </div>
        </div>
      </slot>
    </template>

    <i
      class="iconfont tw-align-bottom icon-help-circle1 tw-pl-[4px] tw-text-[18px] tw-text-subText tw-duration-300 hover:tw-text-black tw-cursor-pointer"
    />
  </el-tooltip>

  <div v-else class="tw-w-[20px]" />
</template>
