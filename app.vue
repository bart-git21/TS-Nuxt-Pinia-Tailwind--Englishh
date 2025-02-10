<script lang="ts" setup>
import { ref } from "vue";
import { myHtml } from "@/utils/helpers";
import TabsTabTranslate from "@/components/tabs/TabTranslate.vue";
import TabsTabDragdrop from "@/components/tabs/TabDragdrop.vue";

const tabs = [
  { name: "translate", label: "Translate" },
  { name: "dragdrop", label: "Drag & Drop" },
  { name: "writing", label: "Writing" },
];
const removedKeyboardListeners = ref(false);
const isChangedTextareaValue = ref(false);
</script>

<template>
  <div>
    <NuxtLayout />

    <main class="w-3/4 m-auto">
      <div class="flex mb-4 h-fit">
        <aside class="w-1/3 flex justify-center bg-black mr-10 p-3">
          <Textarea
            @clicked="(boolean) => (removedKeyboardListeners = boolean)"
            @changeTextareaValue="(boolean) => (isChangedTextareaValue = boolean)"
          />
        </aside>

        <Tabs class="w-2/3" :tabs="tabs">
          <template #default="{ activeTab }">
            <div v-if="activeTab === 'translate'">
              <TabsTabTranslate
                :html="myHtml"
                :isChangedTextareaValue="isChangedTextareaValue"
                :removedKeyboardListeners="removedKeyboardListeners"
              />
            </div>
            <div v-if="activeTab === 'dragdrop'">
                <TabsTabDragdrop />
            </div>
            <div v-if="activeTab === 'writing'">Content for Tab 3</div>
          </template>
        </Tabs>
      </div>

      <NuxtPage :removedKeyboardListeners="removedKeyboardListeners" />
    </main>
  </div>
</template>

<style scoped></style>
