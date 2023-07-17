<template>
  <div fieldName="Gender" value="1" class="misa-radio-group-wrapper">
    <div class="misa-label-field">{{ label }}</div>
    <div class="misa-radio-group">
      <div v-for="(item, index) in listItem" :key="index" :class="{
              'misa-radio-item': true,
              'misa-radio-item-selected': item.value === radioSelected,
            }" @click="handleClickItem(item)" @keyup="(e) => handleKeyup(e, item)">
        <div class="misa-radio-item-out" :tabindex="tabIndex">
          <div class="misa-radio-item-in"></div>
        </div>
        <div class="misa-radio-display">{{ item.display }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, defineProps, computed } from "vue";

const emits = defineEmits(["update:modelValue"]);
const props = defineProps({
  listItem: {
    type: Array,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  modelValue: { type: Number },
  tabIndex: {
    type: Number,
  },
});

const radioSelected = computed(() => {
  return props.modelValue;
});

const handleKeyup = (e, item) => {
  if (e.key == "Enter") emits("update:modelValue", item.value);
};

/**
 * Hàm xử lý sự kiện click vào radio
 * Author: NDKien - (18/06/2023)
 * @param {object} item
 */
const handleClickItem = (item) => {
  emits("update:modelValue", item.value);
};
</script>

<style scoped>
@import url("@/assets/css/common/radiobutton.css");
</style>
