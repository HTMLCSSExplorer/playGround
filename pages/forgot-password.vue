<template>
  <div class="min-h-dvh flex flex-col items-center justify-center">
    <UContainer>
      <UForm
        :state="state"
        :schema="signInSchema"
        class="mx-auto flex w-full max-w-lg flex-col rounded-xl border p-4 sm:p-20"
      >
        <div class="flex w-full flex-col gap-2">
          <p class="text-center">Reset Password</p>
          <div class="flex w-full flex-col gap-4">
            <UButton
              type="button"
              class="flex justify-center gap-2"
              icon="logos-google-icon"
            >
              <span class="text-center">Sign in with google</span>
            </UButton>

            <UButton
              type="button"
              class="flex justify-center gap-2"
              icon="logos-github-icon"
            >
              <span>Sign in with github</span>
            </UButton>
          </div>
        </div>
        <div class="divider my-6 text-xs text-content2 text-center capitalize">
          or continue with
          <span class="w-full border block opacity-15 h-[1px]"></span>
        </div>

        <fieldset class="flex flex-col gap-3">
          <UFormField class="form-field" label="Email address">
            <UInput
              placeholder="Type here"
              type="email"
              class="input max-w-full"
            />
          </UFormField>

          <UFormField class="form-field"> </UFormField>
          <UButton type="button" class="w-full text-center flex justify-center">
            Reset Password
          </UButton>
        </fieldset>
      </UForm>
    </UContainer>
    
  </div>
</template>

<script lang="ts" setup>
const state = ref({
  email: '',
  password: '',
  name: '',
  isLoading: false,
});
</script>

<style></style>
