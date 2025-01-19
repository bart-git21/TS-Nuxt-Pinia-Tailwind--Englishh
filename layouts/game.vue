<template>
  <div>
    <div class="flex mb-4">
      <div class="w-1/2 bg-gray-400 h-full flex justify-center">
        <textarea name="" id="" @input="oninput" @click="onclick"></textarea>
      </div>
      <slot class="w-1/2 bg-gray-500" />
    </div>
  </div>
</template>

<script lang="ts" setup>
const oninput = function () {
  return;
};
const onclick = function () {
  return;
};
</script>
