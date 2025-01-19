import { defineStore } from "pinia";
import { shuffle, createEngPlusRussianSentences } from "@/utils/helpers";

export const useListStore = defineStore("list", {
  state: () => {
    return {
      list: [] as string[][],
    };
  },
  actions: {
    update(string: string): void {
      this.list = createEngPlusRussianSentences(string);
    },
    shuffle(): void {
      shuffle(this.list);
    },
    getShallowCopy(): string[][] {
      this.shuffle();
      return JSON.parse(JSON.stringify(this.list));
    },
  },
});
