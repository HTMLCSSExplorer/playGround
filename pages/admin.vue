<template>
  <div>
    <ClientOnly>
      <UContainer class="p-5">
        <h1>WElcome back {{ user?.displayName }}</h1>
        <UButton
          label="Sign Out"
          class="mt-5 flex items-center"
          type="button"
          @click="handleSignOut"
        />
        <div class="border border-white/20 rounded-2xl mt-10 p-5">
          <ul class="space-y-5">
            <li class="flex justify-around text-center font-bold capitalize">
              <span class="w-full">Grams</span>
              <span class="w-full">Buy Price</span>
              <span class="w-full">curent Price</span>
              <span class="w-full">buy Cost</span>
              <span class="w-full">lost/profile</span>
              <span class="w-full"></span>
            </li>

            <li
              class="flex justify-around text-center even:bg-gray-800 p-2 rounded relative items-center"
              v-if="domData.length > 0"
              v-for="data in domData"
              :key="data"
            >
              <span class="text-center w-full">
                <UInput type="number" v-model="data.grams" />
              </span>
              <span class="text-center w-full">
                <UInput type="number" v-model="data.buyPrice" />
              </span>
              <span class="text-center w-full">
                <UInput type="number" v-model="data.CurrentPrice" />
              </span>
              <span class="text-center w-full">
                {{ data.buyCost.toFixed(2) }}
              </span>
              <span class="text-center w-full">
                {{ data.lostProfit.toFixed(2) }}
              </span>
              <span class="text-center w-full">
                <UButton
                  label="remove"
                  class="bg-red-500 text-white uppercase transition-all duration-300 hover:bg-red-800 cursor-pointer"
                  @click="removeRow(data.id)"
                />
              </span>
            </li>
            <UButton
              type="button"
              label="add row"
              class="uppercase mb-5 font-bold"
              @click="addRow"
            />
          </ul>
        </div>
        <div
          class="border border-white/20 rounded-2xl mt-10 p-5 space-y-2"
          v-if="loaded"
        >
          <h2 class="capitalize font-bold flex gap-1">
            total Grams:<span>{{ totalValues.totalGrams.toFixed(2) }}</span>
          </h2>

          <h2 class="capitalize font-bold flex gap-1">
            total Buy Amount:<span>
              {{ totalValues.totalBuyPrice.toFixed(2) }}
            </span>
          </h2>

          <h2 class="capitalize font-bold flex gap-1">
            total Buy Cost:<span>
              {{ totalValues.totalBuyCost.toFixed(2) }}
            </span>
          </h2>

          <h2 class="capitalize font-bold flex gap-1">
            Lost Profile Amount:<span>
              {{ totalValues.totalLP.toFixed(2) }}
            </span>
          </h2>
          <h2 class="capitalize font-bold flex gap-1">
            Lost Profile percentage:
            <span> {{ totalValues.totalLPPercent.toFixed(2) }} % </span>
          </h2>
        </div>
      </UContainer>
    </ClientOnly>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
  ssr: false,
});
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
const auth = useFirebaseAuth();
const db = useFirestore();
const loaded = ref(false);
const user = useCurrentUser();
const storage = useLocalStorage('transactions', []);
const domData = ref([]);
const addRow = () => {
  const newRow = {
    id: Math.random().toString(32).slice(2),
    grams: 0,
    buyPrice: 0,
    CurrentPrice: 0,
    buyCost: 0,
    lostProfit: 0,
  };
  domData.value.push(newRow);
  storage.value = domData.value;
  loaded.value = true;
};
const removeRow = (id) => {
  domData.value = domData.value.filter((row) => {
    return row.id !== id;
  });
  storage.value = domData.value;
  storage.value.length === 0 ? (loaded.value = false) : '';
};
watch(
  domData,
  (newData) => {
    newData.forEach((item) => {
      item.buyCost = item.grams * item.buyPrice;
    });
  },
  { deep: true } // Ensure reactivity for nested objects
);
watch(
  domData,
  (newData) => {
    newData.forEach((item) => {
      item.lostProfit =
        item.grams * item.CurrentPrice - item.grams * item.buyPrice;
    });
  },
  { deep: true } // Ensure reactivity for nested objects
);

onMounted(async () => {
  if (user) {
    const userRef = doc(db, 'users', user.value.uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      storage.value = docSnap.data().transactions;
      console.log('✅ Firestore data synced to local storage');
    }
  }else{

    
    // domData.value = storage.value;
    // storage.value.length > 0 ? (loaded.value = true) : '';
  }
});

const totalValues = computed(() => {
  let totalGrams = storage.value.reduce((a, b) => a + b.grams, 0);

  let totalBuyPrice = storage.value.reduce((a, b) => a + b.buyPrice, 0);

  let totalBuyCost = storage.value.reduce((a, b) => a + b.buyCost, 0);

  let totalLP = storage.value.reduce((a, b) => a + b.lostProfit, 0);

  let totalLPPercent = (totalLP / totalBuyCost) * 100;

  return {
    totalGrams,
    totalBuyPrice,
    totalBuyCost,
    totalLP,
    totalLPPercent,
  };
});

const handleSignOut = async () => {
  const userRef = doc(db, 'users', user.value.uid);
  const localStorageData = storage.value || [];

  if (userRef) {
    try {
      await updateDoc(userRef, {
        transactions: localStorageData,
      });
      console.log('✅ Local storage data saved to Firestore!');
    } catch (error) {
      console.error('❌ Error saving to Firestore:', error);
    }
  } else {
    console.log('no user ref');
  }
  storage.value = [];
  await signOut(auth);
  return await navigateTo('/', { replace: true });
};
</script>
