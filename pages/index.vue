<template>
  <div class="min-h-dvh flex flex-col items-center justify-center">
    <UContainer>
      <UForm
        :state="state"
        :schema="signInSchema"
        class="mx-auto flex w-full max-w-lg flex-col rounded-xl border p-4 sm:p-20"
        @submit="onSubmit"
        :disabled="isLoading"
        :class="isLoading ? 'opacity-40' : ''"
      >
        <div class="flex w-full flex-col gap-2">
          <p class="text-center">Sign in with</p>
          <div class="flex w-full flex-col gap-4">
            <UButton
              type="button"
              class="flex justify-center gap-2"
              icon="logos-google-icon"
              :disabled="isLoading"
              loading-icon="logos-google-icon"
               :loading="isLoading"
              @click="signinWithGoogleAccount"
            >
              <span>Sign in with google</span>
            </UButton>
          </div>
        </div>
        <div class="divider my-6 text-xs text-content2 text-center capitalize">
          or continue with
          <span class="w-full border block opacity-15 h-[1px]"></span>
        </div>

        <fieldset class="flex flex-col gap-3">
          <UFormField class="form-field" label="Email address" name="email">
            <UInput
              placeholder="Type here"
              type="email"
              class="input max-w-full"
              v-model="state.email"
               :loading="isLoading"
            />
          </UFormField>
          <UFormField label="Password" class="form-field" name="password">
            <UInput
              placeholder="Type here"
              type="password"
              class="input max-w-full"
              v-model="state.password"
               :loading="isLoading"
            />
          </UFormField>
          <UFormField class="form-field">
            <div class="form-control justify-between">
              <label class="form-label">
                <NuxtLink
                  to="/forgot-password"
                  class="link link-underline-hover link-primary text-sm"
                  >Forgot your password?</NuxtLink
                >
              </label>
            </div>
          </UFormField>
          <div class="form-field pt-5">
            <div class="form-control justify-between">
              <UButton
                type="submit"
                class="w-full text-center flex justify-center"
                 :loading="isLoading"
              >
                Sign in
              </UButton>
            </div>
          </div>

          <UFormField class="form-field">
            <div class="form-control">
              <NuxtLink to="/register" class=""
                >Don't have an account? Register.</NuxtLink
              >
            </div>
          </UFormField>
        </fieldset>
      </UForm>
    </UContainer>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
  ssr: false,
});
import { signInWithEmailAndPassword } from 'firebase/auth';
const auth = useFirebaseAuth();
const db = useFirestore();

const state = ref({
  email: '',
  password: '',
  name: '',
  isLoading: false,
});
const { isLoading, startLoading, finishLoading } = useLoading();
const onSubmit = async (values) => {
  startLoading();

  const email = values.data.email;
  const password = values.data.password;
  try {
    // Create a new user calling the API from server side

    //  Sign the new user in using the customToken returned from server

    await signInWithEmailAndPassword(auth, email, password);
    console.log('✅ User Signed in using the customToken');

    return await navigateTo('/admin', { replace: true });
  } catch (error) {
    console.log('❌ Error signing in', error.message);
  } finally {
    finishLoading();
  }
};

const signinWithGoogleAccount = async () => {
  startLoading();
  try {
    const userCredi = await signInUsingGoogleProvider(auth);
    const user = userCredi.user;
    await newFireStoreDB(db, user, user.email, user.displayName);

    return await navigateTo('/admin', { replace: true });
  } catch (googleError) {
    console.log(
      'Error creating account with google account',
      googleError.message
    );
  } finally {
    finishLoading();
  }
};
</script>

<style></style>
