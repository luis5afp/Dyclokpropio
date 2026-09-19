'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT = path.resolve(__dirname, '..');

function read(relative) {
  return fs.readFileSync(path.join(ROOT, relative), 'utf8');
}

const env = read('src/renderer/components/reconstructed/envSerialNums.vue');
assert.match(env, /defineProps\(\['serialNums', 'content'\]\)/);
assert.match(env, /props\.content \? props\.content : props\.serialNums\.join\(' , '\)/);
assert.match(env, /gap:\s*8px/);
assert.match(env, /flex-wrap:\s*nowrap/);

const radio = read('src/renderer/components/reconstructed/CustomRadioGroup.vue');
assert.match(radio, /type:\s*\[String, Number, Boolean\]/);
assert.match(radio, /defineEmits\(\['update:modelValue', 'change'\]\)/);
assert.match(radio, /emit\('update:modelValue', value\)/);
assert.match(radio, /emit\('change', value\)/);
assert.match(radio, /text-color="var\(--primary-color\)"/);
assert.match(radio, /fill="rgba\(255, 255, 255, 0\)"/);

const progress = read('src/renderer/components/reconstructed/OpenProgressBar.vue');
assert.match(progress, /Math\.ceil\(5 \* progress\)/);
assert.match(progress, /v-for="block in 5"/);
assert.match(progress, /block <= activeBlocks/);
assert.match(progress, /#faa63a/);

const truncate = read('src/renderer/components/reconstructed/TruncateText.vue');
assert.match(truncate, /lineNumber:\s*\{/);
assert.match(truncate, /default:\s*2/);
assert.match(truncate, /ResizeObserver/);
assert.match(truncate, /scrollWidth > element\.clientWidth/);
assert.match(truncate, /scrollHeight > element\.clientHeight/);

const warning = read(
  'src/renderer/components/reconstructed/EnvironmentWarningNoticeBanner.vue',
);
assert.match(warning, /defineEmits\(\['close'\]\)/);
assert.match(warning, /default:\s*true/);
assert.match(warning, /emit\('close'\)/);

const flag = read('src/renderer/components/reconstructed/IpCountryFlag.vue');
assert.match(flag, /vue-country-flag-next/);
assert.match(flag, /:country="props\.countryCode"/);
assert.match(flag, /size="big"/);

console.log('Reconstructed Vue component contracts: OK');
