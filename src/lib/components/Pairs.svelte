<script>
  import Connect from "$lib/components/Connect.svelte";

  export let pairs;
  export let onMatch = () => {};
  export let onMismatch = () => {};
  export let onEnd = () => {};

  let randomizedItemsA = getRandomItems(pairs).a;
  let randomizedItemsB = getRandomItems(pairs).b;
  let matchedPairs = [];
  let startElement = null;
  let startElementType = null;
  let draggedOverElement = null;
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

  function isSameElement(elementA, elementB) {
    if (!elementA || !elementB) {
      return false;
    }

    return elementA === elementB || elementA.contains(elementB) || elementB.contains(elementA);
  }

  function isSameType(typeA, typeB) {
    return typeA === typeB;
  }

  function handleConnectStart(target) {
    if (!target) return;

    startElement = target;
    startElementType = target.dataset.type;
  }

  function handleConnectHover(target) {
    console.log(target)
    draggedOverElement = target;
  }

  function handleConnectEnd(target) {
    if (!target || target.dataset.type === startElementType) {
      startElement = null;
      startElementType = null;
      draggedOverElement = null;
      return;
    }

    if (target.dataset.id === startElement.dataset.id) {
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
  onConnectHover={handleConnectHover}
  onConnectEnd={handleConnectEnd}
>
  <div class="h-full flex justify-center items-center">
    <div class="w-full sm:max-w-96 grid grid-cols-2 gap-4">
      <div class="flex flex-col gap-2">
        {#each randomizedItemsA as item, index (item)}
          <div class="animate-in from-left" style="animation-delay: {100 * index + 1}ms">
            <div
              class="p-4 text-center rounded-full bg-secondary/25 ring-2 ring-inset ring-secondary transition-all duration-300 select-none"
              class:scale-105={isSameElement(this?.first, startElement) || isSameElement(this?.first, draggedOverElement) && !isSameType("a", startElementType)}
              class:is-match={matchedPairs.includes(item.id)}
              data-id={item.id}
              data-type="a"
              data-connect="a"
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
              class="p-4 text-center rounded-full bg-primary text-secondary ring ring-2 ring-inset ring-secondary transition-all duration-300 select-none"
              class:scale-105={isSameElement(this?.first, startElement) || isSameElement(this?.first, draggedOverElement) && !isSameType("b", startElementType)}
              class:is-match={matchedPairs.includes(item.id)}
              data-id={item.id}
              data-type="b"
              data-connect="b"
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
