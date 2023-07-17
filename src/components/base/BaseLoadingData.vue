<template>
  <div class="m-overlay-loading">
    <div class="m-loading-icon"></div>
  </div>
</template>
<style scoped>
.m-overlay-loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.m-loading-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  background: url("@/assets/icon/loading.svg") no-repeat;
  background-size: cover;
  width: 40px;
  height: 40px;
  transform: translate(-50%, -50%);
  animation: rote ease-in-out 1.2s infinite;
}

@keyframes rote {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
