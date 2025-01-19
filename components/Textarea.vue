<script lang="ts" setup>
import { ref } from "vue";
import { useListStore } from "@/stores/list";

const emits = defineEmits(["changeTextareaValue", "clicked"]);
const textAreaValue = ref("");

const oninput = () => {
  emits("changeTextareaValue", true);
  updateList();
};
const onblur = () => {
    emits("changeTextareaValue", false);
    emits("clicked", false);
}
const updateList = () => {
  const string = textAreaValue.value || "";
  if (!string) return;
  useListStore().update(string);
};
</script>

<template>
  <textarea
    class="textArea caret-white outline-none p-2"
    spellcheck="false"
    name=""
    id=""
    @input="oninput"
    @click="$emit('clicked', true)"
    @blur="onblur"
    v-model="textAreaValue"
  ></textarea>
</template>

<style scoped>
.textArea {
  width: 100%;
  background-image: linear-gradient(
    to bottom right,
    rgba(250, 6, 6, 0.9),
    rgba(85, 2, 81, 0.9)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  border: 5px solid red;
  transition: all 0.5s ease-in-out;
  -webkit-transition: all 0.5s ease-in-out;

  &:hover,
  &:focus {
    -webkit-background-clip: none;
    -webkit-text-fill-color: #fff;
    border-color: white;
    transition: all 0.3s ease-in-out;
  }
}
</style>
