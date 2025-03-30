export const useLoading = () => {
  const loadBar = useLoadingIndicator();
  const isLoading = ref(false);

  const startLoading = (state) => {
    isLoading.value = true;
    loadBar.start();
  };

  const finishLoading = (state) => {
    isLoading.value = false;
    loadBar.finish();
  };

  return {
    isLoading,
    startLoading,
    finishLoading,
  };
};
