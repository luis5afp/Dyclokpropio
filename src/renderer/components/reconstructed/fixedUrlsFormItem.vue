<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Tip from './Tip.vue'

const props = defineProps({
  modelValue: {},
})

const emit = defineEmits(['update:modelValue'])
const { t } = useI18n()

const textValue = computed({
  get() {
    return props.modelValue?.join('\n')
  },
  set(value) {
    emit('update:modelValue', value.split('\n'))
  },
})

const rules = [
  {
    validator(_rule, _value, callback) {
      const urls = (props.modelValue || []).filter((value) => value)
      emit('update:modelValue', urls)

      if (
        !urls.every(
          (url) => url.startsWith('http') || url.startsWith('chrome'),
        )
      ) {
        return callback(new Error(t('env.env.req.urlsCorrectRule')))
      }

      callback()
    },
    trigger: 'blur',
  },
]
</script>

<template>
  <el-form-item prop="fixedUrls" :rules="rules">
    <template #label>
      <div class="envV2-input-layout">
        {{ t('envV2.fixedUrls') }}
        <Tip :text="t('envV2.tip26')" />
      </div>
    </template>

    <el-input
      v-model="textValue"
      :autosize="{ minRows: 3, maxRows: 5 }"
      type="textarea"
      :placeholder="t('envV2.fixedUrlsTip1')"
    />
  </el-form-item>
</template>
