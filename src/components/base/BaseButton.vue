<template>
  <button :class="[
    'm-button',
    isExtra ? 'm-button-no-primary' : '',
    { 'button-only-icon': isOnlyIcon },
    { 'has-icon': hasIcon },
  ]" :style="{ height: height, minWidth: minWidth }" :tabindex="tabIndex">
    <div class="m-button-icon-wrapper" v-if="icon">
      <div class="m-button-icon" :class="icon"></div>
    </div>
    <div :class="['m-button-name', { 'no-display': isOnlyIcon }]">
      {{ text }}
    </div>
  </button>
</template>
<script>
export default {
  props: {
    isExtra: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      default: "",
    },
    isOnlyIcon: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: "",
    },
    height: {
      type: String,
      default: "36px",
    },
    minWidth: {
      type: String,
      default: "80px",
    },
    tabIndex: {
      type: Number,
    },
  },
};
</script>

<style scoped>
@import url("@/assets/css/common/icon.css");
@import url("@/assets/css/common/button.css");
</style>
