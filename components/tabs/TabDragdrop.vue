<script lang="ts" setup>
import { shuffle } from "@/utils/helpers.js";
const store = useListStore();
const props = defineProps(["changedList", "removeListeners"]);
const counter = ref(0);

const handleChangedList = () => {};
const handleRemoveKeyListener = () => {};

interface Sentence {
  list: string[][];
}
const sentences: Sentence = reactive({
  list: [["first word", "слово"]],
});

const sentence: ComputedRef<string[]> = computed(() => {
  let words: string[] =
    sentences.list.length > 0
      ? sentences.list[counter.value][0].split(" ")
      : [];
  shuffle(words);
  return words;
});

// logic
const start = () => {
  counter.value = 0;
  sentences.list = store.getShallowCopy();
  displaySentence();
};

const displaySentence = () => {
  if (counter.value < sentences.list.length) {
    counter.value++;
  } else counter.value = -1;
};

watch(props.changedList, (newVal, oldChangedList) => {
  if (newVal) {
    handleChangedList();
  }
});
watch(props.removeListeners, (newVal, oldremoveListeners) => {
  if (newVal) {
    handleRemoveKeyListener();
  }
});
</script>

<template>
  <h1>Drag & Drop</h1>
  <div class="card-body d-flex flex-column justify-content-center text-center">
    <h2 id="dragdrop_question" class="dragdrop__question fs-1 text-light">
      <div class="btn--red" v-for="(word, index) in sentence" :key="index">
        {{ word }}
      </div>
    </h2>
    <div
      id="dragdrop_answer"
      class="dragdrop__answer mb-2 position-relative h-50 fs-4 link-body-emphasis"
    ></div>
  </div>

  <div class="card-footer position-relative">
    <button id="dragdrop_btn_start" class="btn btn--red" @click="start">
      <i class="fas fa-power-off"></i> Start
    </button>
    <button id="dragdrop_btn_check" class="btn btn--red">
      <i class="fas fa-play"></i> Check and Continue
    </button>
    <div
      class="progress mt-3"
      role="progressbar"
      aria-label="Example 30px high"
      aria-valuenow="0"
      aria-valuemin="0"
      aria-valuemax="100"
      style="height: 30px"
    >
      <div
        id="drag_drop_progress_bar"
        class="progress-bar"
        style="width: 0%"
      ></div>
    </div>

    <div class="text-light">
      <h4>Keyboard buttons control:</h4>
      <div>
        <i class="fa-solid fa-square-caret-left"></i> - return last sentence
      </div>
      <div>
        <i class="fa-solid fa-square-caret-right"></i> - check result and call
        next sentence
      </div>
      <div>[Spacebar] - start from begining</div>
    </div>
  </div>
</template>

<style scoped>
.btn--red {
  max-width: max-content;
  padding: 5px 10px;
  border: 5px solid;
  border-image-slice: 1;
  @apply bg-gradient;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  border-image-source: linear-gradient(
    to left top,
    #dd2476 20%,
    #ff512f 80%
  ) !important;
  text-decoration: none;
  transition: all 0.4s ease;
  user-select: none;

  &:hover,
  &:focus {
    cursor: pointer;
    -webkit-background-clip: none !important;
    -webkit-text-fill-color: #000 !important;
    border: 5px solid #000 !important;
    box-shadow: #222 1px 0 10px;
  }
}
</style>
