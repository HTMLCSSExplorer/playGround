<template>
  <div>
    <header class="p-5">
      <UContainer>
        <nav class="flex justify-between">
          <nuxt-link to="/">Home</nuxt-link>
          <div class="flex gap-5" v-if="!user">
            <NuxtLink to="/">Sign In</NuxtLink>
            <NuxtLink to="/register" >Register</NuxtLink>
          </div>
        </nav>
      </UContainer>
    </header>
    <slot />
  </div>
</template>

<script lang="ts" setup>

const user = useCurrentUser()

</script>

<style></style>
