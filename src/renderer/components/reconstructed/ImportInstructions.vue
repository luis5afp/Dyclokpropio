<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div
    class="tw-bg-[var(--bg-light4)] tw-rounded-[8px] tw-text-[var(--w-e-textarea-border-color)] tw-p-[16px]"
  >
    <div>
      <div>{{ t('env.env.import.txtFilePreviewTitle') }}</div>
      <div class="tw-text-[14px]">
        {{ t('env.env.import.txtFilePreviewTip') }}
      </div>
      <div class="tw-text-[14px]">
        {{ t('env.env.import.txtFilePreviewTip2') }}
      </div>
    </div>

    <div class="tw-mt-[12px]">
      <div>{{ t('env.env.import.txtFilePreviewTip4') }}</div>
      <div class="tw-text-[14px] tw-break-all tw-mb-[10px]">
        61573712412345|abc@hotmail.com|RcDtLU68|c_user=615737124123456;xs=28:QaQ1PlqUASA:2:1742926124:-1:-1;fr=0ay9sjkwe1EOC6F.AW23c9wKXYt2XSSD2wFSPr8AeQ.Bn4vQ1..AAA.0.0.Bn4vQ1.A1Q-suJiM;datr=NfTiZz50vn0W7d0sP;
      </div>
    </div>

    <div class="tw-text-[14px]">
      {{ t('env.env.import.txtFilePreviewTip3', { pipe: '|' }) }}
    </div>
  </div>
</template>
