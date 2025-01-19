<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { shuffle } from "@/utils/helpers";
import { useListStore } from "@/stores/list";

const props = defineProps([
  "isChangedTextareaValue",
  "removedKeyboardListeners",
  "myHtml",
]);

const initialList = ref([] as string[][]);
const initialAmount = ref(0);
const trainingList = ref([] as string[][]);
const question = ref("");
const answer = ref("");
const counter = ref(0);
const isPlay = ref(false);
const timerId = ref(setTimeout(() => {}, 0));

// progress bar
const progress = ref(0);

// timer for sentence to show
const translateDelay = ref(10);
const showedPopup = ref(false);
const isChangingDelay = ref(false);

// ================= DOM elements =================
const btnContinue = ref(null as HTMLElement | null);

const setQuestionAndAnswer = (q: string, a: string) => {
  question.value = q;
  answer.value = a;
};

const displayResult = (number: number) => {
  answer.value = "";

  switch (true) {
    case number === 0:
      question.value = "Keep going!";
      break;
    case number > 0: {
      question.value = `
            Well done!
            You deleted ${number} ${number === 1 ? "card" : "cards"}!
        `;
      break;
    }
    default:
      question.value = "Click to start!";
      break;
  }
};

const updateDelay = (value: number = 0): boolean => {
  if (isChangingDelay.value) return false;
  isChangingDelay.value = true;
  translateDelay.value = value;
  setTimeout(() => {
    isChangingDelay.value = false;
  }, 2000);
  return true;
};

const showPopup = () => {
  showedPopup.value = true;
  setTimeout(() => {
    showedPopup.value = false;
  }, 2000);
};

const updateProgress = () => {
  progress.value = initialList.value.length
    ? initialAmount.value -
      initialList.value.length -
      trainingList.value.length
    : 0;
};

const addKeyListener = () => {
  if (myHtml) {
    myHtml.onkeyup = (event: KeyboardEvent): void => {
      switch (event.key) {
        case "ArrowUp":
          updateDelay(translateDelay.value + 0.5) && showPopup();
          break;
        case "ArrowDown":
          updateDelay(translateDelay.value - 0.5) && showPopup();
          break;
        case "ArrowLeft":
          prevSentence();
          break;
        case "ArrowRight":
          nextSentence();
          break;
        case "Delete":
          deleteSentence();
          break;
        case " ":
          start();
          break;
      }
    };
  } else {
    console.warn(
      "DOM is not rendered and myHtml is not defined. Ensure the DOM is fully loaded."
    );
  }
};

const removeKeyListener = () => {
  myHtml && (myHtml.onkeyup = null);
};

const clear = () => {
  initialList.value = trainingList.value = [];
  question.value = "The sentences are changed. Click to start!";
  answer.value = "";
};

const start = () => {
  try {
    stop();
    const store = useListStore();
    initialList.value = store.getShallowCopy();
    if (!initialList.value.length) {
      question.value = "The list is empty!";
      return;
    }
    trainingList.value = [];
    initialAmount.value = initialList.value.length;
    addKeyListener();
    btnContinue.value?.focus();
    addSentence();
    play();
  } catch (err) {
    if (err instanceof Error) console.error(err.message);
  }
};

const deleteSentence = () => {
  if (!isPlay.value || !trainingList.value.length) return;
  stop();
  trainingList.value.splice(counter.value, 1);
  updateProgress();
  play();
};

const addSentence = () => {
  try {
    counter.value = 0;
    if (initialList.value.length && trainingList.value.length < 11) {
      trainingList.value.push(initialList.value.pop() as string[]);
    }
    trainingList.value.length > 1 && shuffle(trainingList.value);
  } catch (err) {
    if (err instanceof Error) console.error(err.message);
  }
};

const prevSentence = () => {
  if (!isPlay.value || !trainingList.value.length) return;
  stop();
  counter.value > 0 && (counter.value -= 1);
  play();
};

const nextSentence = () => {
  stop();
  addKeyListener();
  counter.value < trainingList.value.length ? counter.value++ : addSentence();
  play();
};

const play = async () => {
  try {
    if (!initialList.value.length && !trainingList.value.length) {
      displayResult(-1);
      return;
    }
    isPlay.value = true;
    while (counter.value < trainingList.value.length) {
      setQuestionAndAnswer(
        trainingList.value[counter.value][1],
        trainingList.value[counter.value][0]
      );
      await new Promise<void>((resolve) => {
        timerId.value = setTimeout(() => {
          counter.value += 1;
          resolve();
        }, translateDelay.value * 1000);
      });
    }
    displayResult(progress.value);
    isPlay.value = false;
  } catch (err) {
    if (err instanceof Error) console.log(err.message);
  }
};

const stop = () => {
  clearTimeout(timerId.value);
  isPlay.value = false;
  question.value = "The game is stopped. Click to continue";
  answer.value = "";
};

watchEffect(() => {
  if (props.removedKeyboardListeners) {
    stop();
    removeKeyListener();
  }
  if (props.isChangedTextareaValue) {
    stop();
    clear();
    removeKeyListener();
  }
});

onMounted(() => {
  addKeyListener();
});
</script>

<template>
  <section class="bg-black text-white">
    <div
      class="translate__body text-center flex flex-col justify-center items-center gap-20"
    >
      <h2 class="text-3xl">
        {{ question }}
      </h2>
      <h4 id="translate_answer" class="text-gray-800">
        {{ answer }}
      </h4>
    </div>

    <div class="translate__buttons grid grid-cols-3 gap-5 m-4">
      <Button @click="start" icon="fa-power-off">Start</Button>
      <Button @click="nextSentence" htmlRef="btnContinue" icon="fa-play"
        >Continue</Button
      >
      <Button @click="stop" icon="fa-pause">Stop</Button>
    </div>

    <div class="translate__footer relative p-4">
      Timer for each sentence to show, seconds:
      <input
        class="btn btn--red mr-2 text-black"
        type="text"
        placeholder="Leave a number here"
        v-model="translateDelay"
        @blur="updateDelay(translateDelay)"
      />
      <div :class="['popup', showedPopup && 'show']">
        {{ translateDelay }}
      </div>

      <div
        class="w-100 bg-neutral-200 dark:bg-neutral-600 m-3"
        v-show="!!progress"
      >
        <div
          class="bg-red-800 p-2 text-center text-s font-medium leading-none text-primary-100"
          :style="{
            width:
              progress && (progress / Number(initialAmount)) * 100 + '%',
          }"
        >
          <span
            >{{ Math.round((progress / Number(initialAmount)) * 100) }} %
            -
            {{
              progress === 1
                ? `1 sentence is learned`
                : `${progress} sentences are learned`
            }}</span
          >
        </div>
      </div>

      <div class="text-light">
        <h4>Keyboard buttons control:</h4>
        <div>
          <i class="fa-solid fa-square-caret-left"></i> - return last card
        </div>
        <div>
          <i class="fa-solid fa-square-caret-right"></i> - call next card
        </div>
        <div>
          <i class="fa-solid fa-square-caret-up"></i
          ><i class="fa-solid fa-square-caret-down"></i> - To increase or
          decrease the delay time by 0.5 second
        </div>
        <div>[Spacebar] - start from the beginning</div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.translate__body {
  height: max(300px, 30vh);
  background: linear-gradient(to bottom right, red, purple);
}
.popup {
  position: absolute;
  top: -10%;
  left: 0%;
  opacity: 0;
  transform: translateX(-50%);
  color: white;
  font-size: 28px;
  /* transition: opacity 0.3s ease; */
}
.show {
  animation: showPopup 1.7s ease;
}
@keyframes showPopup {
  0% {
    opacity: 0;
    transform: translateX(0%) translateY(0%);
  }
  100% {
    opacity: 1;
    transform: translateX(200%) translateY(-100%);
  }
}
</style>
