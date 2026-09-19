<script setup>
import CountryFlag from 'vue-country-flag-next'

const props = defineProps({
  countryCode: {},
})
</script>

<template>
  <span
    v-if="props.countryCode"
    class="tw-relative tw-inline-flex tw-h-[21px] tw-w-[21px] tw-flex-none tw-overflow-hidden tw-align-middle tw-text-[0] tw-leading-none"
    aria-hidden="true"
  >
    <CountryFlag
      :country="props.countryCode"
      size="big"
      class="!tw-absolute !tw-left-1/2 !tw-top-1/2 !tw-m-0 !tw-origin-center !tw-scale-[0.4] !tw--translate-x-1/2 !tw--translate-y-1/2"
    />
  </span>
</template>
