<template>
    <div :class="iconClass">
    </div>
</template>

<script>
export default {
    name: 'MIcon',
    props: {
        iconClass: { type: String, default: '' },
    }
}
</script>

<style scoped>
@import url("@/assets/css/common/icon.css");

div {
    cursor: pointer;
}
</style>