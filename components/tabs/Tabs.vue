<template>
  <div>
    <div class="tab-nav">
      <div
        v-for="tab in tabs"
        :key="tab.name"
        class="tab-link"
        :class="{ active: tab.name === activeTab }"
        @click="setActiveTab(tab.name)"
      >
        {{ tab.label }}
      </div>
    </div>
    <div class="tab-content">
      <slot :activeTab="activeTab" />
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, watch } from "vue";

const props = defineProps({
  tabs: {
    type: Array,
    required: true,
  },
});

const activeTab = ref(props.tabs[0].name);

const setActiveTab = (tabName) => {
  activeTab.value = tabName;
};

// Watch for changes in props to update activeTab if necessary
watch(
  () => props.tabs,
  (newTabs) => {
    if (!newTabs.find((tab) => tab.name === activeTab.value)) {
      activeTab.value = newTabs[0].name;
    }
  }
);
</script>

<style scoped>
.tab-nav {
  display: flex;
  cursor: pointer;
}

.tab-link {
  flex: 0 1 33.33%;
  padding: 10px;
  border: 1px solid #ccc;
  border-bottom: none;
  text-align: center;
}

.tab-link.active {
  background-color: #f0f0f0;
  font-weight: bold;
}

.tab-content {
  border: 1px solid #ccc;
}
</style>
