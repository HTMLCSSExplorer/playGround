<template>
  <div class="min-h-dvh flex flex-col items-center justify-center">
    <UContainer>
      <UForm
        :state="state"
        :schema="signUpSchema"
        class="mx-auto flex w-full max-w-lg flex-col rounded-xl border p-4 sm:p-20"
        @submit="onSubmit"
        as="form"
        :loading="isLoading"
      >
        <div class="flex w-full flex-col gap-2">
          <p class="text-center">Register</p>
          <div class="flex w-full flex-col gap-4">
            <UButton
              type="button"
              class="flex justify-center gap-2"
              icon="logos-google-icon"
              loading-icon="logos-google-icon"
              :loading="isLoading"
              @click="signInWithGoogle"
            >
              <span class="text-center">Sign in with google</span>
            </UButton>
          </div>
        </div>
        <div class="divider my-6 text-xs text-content2 text-center capitalize">
          or continue with
          <span class="w-full border block opacity-15 h-[1px]"></span>
        </div>

        <fieldset class="flex flex-col gap-3">
          <UFormField class="form-field" label="Full name" name="name">
            <UInput
              placeholder="Type here"
              type="text"
              class="input max-w-full"
              v-model="state.name"
              :loading="isLoading"
            />
          </UFormField>

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
          <UFormField class="form-field"> </UFormField>
          <div class="form-field pt-5">
            <div class="form-control justify-between">
              <UButton
                type="submit"
                class="w-full text-center flex justify-center"
                :loading="isLoading"
              >
                Sign Up
              </UButton>
            </div>
          </div>

          <UFormField class="form-field">
            <div class="form-control">
              <NuxtLink to="/" class=""
                >Already have an account? Sign in.</NuxtLink
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
const auth = useFirebaseAuth();
const db = useFirestore();
const { isLoading, startLoading, finishLoading } = useLoading();
const state = ref({
  name: '',
  email: '',
  password: '',
});

const onSubmit = async (values) => {
  const name = values.data.name;
  const email = values.data.email;
  const password = values.data.password;
  startLoading();

  try {
    //   Call the server PI to create a new user using proided email and password
    const response = await $fetch('/api/signup', {
      method: 'post',
      body: {
        email,
        password,
      },
    });
    const user = response.user;
    const customToken = response.customToken;
      provide('customToken',customToken)

    //  sign the  newUser in using a customToken return in response from API
    await signInWithCustomtoken(auth, customToken);

    // Update the profile and add the user's display name
    await updateUserPropfile(auth, user, state.value.name);

    // Create a new Firestore collection for the user and assing
    await newFireStoreDB(db, user, email, name);

    //  Navigating to the admin page
    return await navigateTo('/admin', { replace: true });
  } catch (error) {
    console.log('Error Creating a new account', error.message);
  } finally {
    finishLoading();
  }
};

const signInWithGoogle = async () => {
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
