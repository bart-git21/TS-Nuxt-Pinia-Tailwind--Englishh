<template>
  <header class="mb-6">
    <nav>
      <ul class="flex">
        <li><NuxtLink to="/">Home</NuxtLink></li>
        <li><NuxtLink to="/dragdrop">Drag & Drop game</NuxtLink></li>
        <li><NuxtLink to="/writing">Writing game</NuxtLink></li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
li {
    @apply p-2;
    &:hover {
        @apply text-white bg-black;
    }
}
</style>