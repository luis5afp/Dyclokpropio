<script setup>
const props = defineProps({
  closable: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['close'])

const classes = {
  root: 's-flex tw-mb-[12px] tw-min-h-[40px] tw-w-full !tw-justify-between tw-rounded-[6px] tw-border tw-border-warning tw-bg-warning-10 tw-px-4 tw-py-0 tw-text-[12px] tw-leading-[18px]',
  content: 's-flex tw-min-w-0 tw-gap-[8px]',
  message: 'tw-truncate tw-text-[12px] tw-leading-[18px] tw-text-warning',
  button: 'before:!tw-bg-transparent before:!tw-shadow-none tw-shrink-0 !tw-h-auto !tw-p-0 tw-text-[12px] tw-leading-[18px] !tw-shadow-none',
  text: 'tw-font-light tw-leading-[18px]',
  close: 'tw-shrink-0 !tw-h-auto !tw-p-0 tw-text-[12px] tw-leading-[18px]',
}
</script>

<template>
  <section :class="classes.root">
    <div :class="classes.content">
      <span :class="classes.message">
        <slot />
      </span>

      <slot name="actions" :classes="classes" />
    </div>

    <el-button
      v-if="props.closable"
      :class="classes.close"
      link
      type="info"
      @click="emit('close')"
    >
      <slot name="close">
        <i class="iconfont icon-fail" />
      </slot>
    </el-button>
  </section>
</template>
