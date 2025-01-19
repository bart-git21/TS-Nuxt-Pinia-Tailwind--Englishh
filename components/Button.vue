<script setup lang="ts">
const props = defineProps(["htmlRef", "icon"]);
</script>

<template>
  <button class="rounded-md p-2 outline-none" :ref="props.htmlRef">
    <i :class="['fas', props.icon]"></i>
    <slot></slot>
  </button>
</template>

<style scoped>
button {
    font-size: 20px;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-image: linear-gradient(to bottom right, red, purple);
  border: 5px solid red;
  transition: all 0.3s ease-in-out;
}
button:hover,
button:focus {
  border-color: white;
  background-image: linear-gradient(to bottom, white, white);
}
</style>
