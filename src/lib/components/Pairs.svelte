<script>
  import Connect from "$lib/components/Connect.svelte";

  export let pairs;
  export let onMatch = () => {};
  export let onMismatch = () => {};
  export let onEnd = () => {};

  let randomizedItemsA = getRandomItems(pairs).a;
  let randomizedItemsB = getRandomItems(pairs).b;
  let matchedPairs = [];
  let onEndTimer;

  function randomizeArray(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  function getRandomItems(pairs) {
    let itemsA = [];
    let itemsB = [];

    pairs.forEach((pair, index) => {
      itemsA.push({ id: index, value: pair[0]});
      itemsB.push({ id: index, value: pair[1]});
    });

    return { a: randomizeArray(itemsA), b: randomizeArray(itemsB) };
  }

  function handleConnectStart(target) {
    if (!target) return;
  }

  function handleConnectEnd(target, startTarget) {
    if (!target || !startTarget) return;
    if (target === startTarget) return;
    if (target.dataset.connect === startTarget.dataset.connect) return;

    if (target.dataset.id === startTarget.dataset.id) {
      matchedPairs = [...matchedPairs, Number(target.dataset.id)];
      onMatch(target);

      if (matchedPairs.length === pairs.length) {
        clearTimeout(onEndTimer);
        onEndTimer = setTimeout(() => {
          onEnd();
        }, 500);
      }
    } else {
      onMismatch(target);
    }
  }

</script>

<Connect 
  onConnectStart={handleConnectStart}
  onConnectEnd={handleConnectEnd}
>
  <div class="h-full flex justify-center items-center px-4">
    <div class="w-full sm:max-w-96 grid grid-cols-2 gap-4">
      <div class="flex flex-col gap-2">
        {#each randomizedItemsA as item, index (item)}
          <div class="animate-in from-left" style="animation-delay: {100 * index + 1}ms">
            <div
              class="p-4 text-center rounded-full bg-secondary/75 text-primary transition-all duration-300 select-none"
              class:is-match={matchedPairs.includes(item.id)}
              data-id={item.id}
              data-connect="right"
            >
              {item.value}
            </div>
          </div>
        {/each}
      </div>

      <div class="flex flex-col gap-2">
        {#each randomizedItemsB as item, index (item)}
          <div class="animate-in from-right" style="animation-delay: {100 * index + 1}ms">
            <div
              class="p-4 text-center rounded-full bg-primary text-secondary ring-2 ring-inset ring-secondary transition-all duration-300 select-none"
              class:is-match={matchedPairs.includes(item.id)}
              data-id={item.id}
              data-connect="left"
            >
              {item.value}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</Connect>

<style>
  .animate-in {
    opacity: 0;
    animation: appear 300ms forwards;
  }

  .from-left {
    transform: translateX(-2rem);
  }

  .from-right {
    transform: translateX(2rem);
  }

  @keyframes appear {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .is-match {
    pointer-events: none;
    opacity: 0;
    scale: .5;
  }
</style>
