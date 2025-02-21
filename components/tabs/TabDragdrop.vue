<script lang="ts" setup>
import { shuffle } from "@/utils/helpers.js";
const store = useListStore();
const props = defineProps(["changedList", "removeListeners"]);
const counter = ref(0);
const target = ref(null) as Ref<HTMLElement | null>;
const isMove = ref(false);
const gameField = ref() as Ref<HTMLElement>;

const handleChangedList = () => {};
const handleRemoveKeyListener = () => {};

interface Sentence {
  list: string[][];
}
const sentences: Sentence = reactive({
  list: [["first word", "слово"]],
});

const sentence: Ref<string[]> = ref([]);

// logic
const start = () => {
  sentences.list = store.getShallowCopy();
  if (!sentences.list.length) {
    alert("The list is empty.");
    return;
  }
  counter.value = 0;
  initSentence();
};

const initSentence = () => {
  if (counter.value < sentences.list.length) {
    let words: string[] =
      sentences.list.length > 0
        ? sentences.list[counter.value][0].trim().toLowerCase().split(" ")
        : [];
    shuffle(words);
    sentence.value = words;
  } else counter.value = -1;
};

const compareStrings = () => {
  const nodeList = document.querySelectorAll<HTMLDivElement>(
    ".btn--word"
  ) as NodeListOf<HTMLDivElement>;
  let buttons: HTMLDivElement[] = [...nodeList];
  const userOrder: { [key: number]: string } = {};
  buttons.forEach((e: HTMLDivElement) => {
    const xCoord = e.getBoundingClientRect().x;
    const key: number = Math.floor(xCoord);
    userOrder[key] = e.textContent ?? "";
  });
  const userString = Object.values(userOrder).join(" ").toLowerCase();
  return userString === sentences.list[counter.value][0].trim().toLowerCase();
};

const check = () => {
  compareStrings() ? incrementCounter() : alert("It's not correct. Try again!");
};

const mousedown = (event: MouseEvent) => {
  const clickedElement = event.target as HTMLElement;
  target.value = [...clickedElement?.classList].includes("btn--word")
    ? clickedElement
    : null;
};

const move = (event: MouseEvent) => {
  if (!target.value) return;
  if (isMove.value) return;
  isMove.value = true;
  target.value.style.position = "absolute";
  target.value.style.left = `${event.clientX}px`;
  target.value.style.top = `${event.clientY}px`;
  setTimeout(() => {
    isMove.value = false;
  }, 50);
};

const incrementCounter = () => {
  counter.value++;
};

watch(counter, (val, oldChangedList) => {
  initSentence();
});

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
  <div class="card-body flex flex-col text-center">
    <h2 class="flex-none dragdrop__question">
      {{ sentences.list[counter][1] }}
    </h2>
    <div
      class="board grow"
      ref="gameField"
      @mousedown="mousedown"
      @mousemove="move"
    >
      <div class="btn btn--word" v-for="(word, index) in sentence" :key="index">
        {{ word }}
      </div>
    </div>
  </div>

  <div class="card-footer position-relative">
    <button id="dragdrop_btn_start" class="btn btn--red" @click="start">
      <i class="fas fa-power-off"></i> Start
    </button>
    <button id="dragdrop_btn_check" class="btn btn--red" @click="check">
      <i class="fas fa-play"></i> Check and Continue
    </button>
    <button
      id="dragdrop_btn_check"
      class="btn btn--red"
      @click="incrementCounter"
    >
      <i class="fas fa-play"></i> Continue
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
.card-body {
  color: #fff;
  height: max(300px, 30vh);
  background: linear-gradient(to bottom right, red, purple);
}
.btn {
  cursor: pointer;
  max-width: max-content;
  padding: 5px 10px;
  border: 5px solid;
  text-decoration: none;
  transition: all 0.4s ease;
  user-select: none;
  color: #fff;

  &:hover,
  &:focus {
    box-shadow: #222 1px 0 10px;
  }
}
.btn--red {
  border-image-slice: 1;
  @apply bg-gradient;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  border-image-source: linear-gradient(
    to left top,
    #dd2476 20%,
    #ff512f 80%
  ) !important;

  &:hover,
  &:focus {
    -webkit-background-clip: none !important;
    -webkit-text-fill-color: #000 !important;
    border: 5px solid #fff !important;
  }
}
.btn--word {
  display: inline-block;

  &:hover,
  &:focus {
    border: 5px solid #000 !important;
  }
}
</style>
