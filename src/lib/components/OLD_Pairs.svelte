<script>
  export let pairs;
  export let onMatch = () => {};
  export let onMismatch = () => {};
  export let onEnd = () => {};

  let randomizedItemsA = getRandomItems(pairs).a;
  let randomizedItemsB = getRandomItems(pairs).b;
  let matchedPairs = [];
  let draggedElementType = null;
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

  function handleDragStart(event) {
    event.dataTransfer.setData("text/plain", event.target.dataset.id);
    event.dataTransfer.setData("type", event.target.dataset.type);

    draggedElementType = event.target.dataset.type;
  }

  function handleDragOver(event) {
    event.preventDefault();
    
    draggedOverElement = event.target;
  }

  function handleDrop(event) {
    event.preventDefault();

    draggedElementType = null;

    const draggedId = event.dataTransfer.getData("text/plain");
    const draggedType = event.dataTransfer.getData("type");
    const droppedId = event.target.dataset.id;
    const droppedType = event.target.dataset.type;

    if (draggedType === droppedType) {
      return;
    }

    if (draggedId === droppedId && draggedType !== droppedType) {
      matchedPairs = [...matchedPairs, parseInt(draggedId)];

      onMatch(draggedId);

      if (matchedPairs.length === pairs.length) {
        clearTimeout(onEndTimer);
        onEndTimer = setTimeout(() => {
          onEnd();
        }, 500);
      }
    } else {
      onMismatch(draggedId);
    }
  }

  function handleDragEnd() {
    draggedOverElement = null;
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
</script>

<div class="w-full sm:max-w-96 grid grid-cols-2 gap-4">
  <div class="flex flex-col gap-2">
    {#each randomizedItemsA as item, index (item)}
      <div class="animate-in from-left" style="animation-delay: {100 * index + 1}ms">
        <div
          class="p-4 text-center rounded-full bg-secondary text-primary transition-all duration-300"
          class:scale-105={isSameElement(this?.first, draggedOverElement) && !isSameType("a", draggedElementType)}
          class:is-match={matchedPairs.includes(item.id)}
          data-id={item.id}
          data-type="a"
          draggable="true"
          on:dragstart={handleDragStart}
          on:dragover={handleDragOver}
          on:dragleave={handleDragEnd}
          on:dragend={handleDragEnd}
          on:drop={handleDrop}
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
          class="p-4 text-center rounded-full bg-primary text-secondary ring ring-2 ring-inset ring-secondary transition-all duration-300"
          class:scale-105={isSameElement(this?.first, draggedOverElement) && !isSameType("b", draggedElementType)}
          class:is-match={matchedPairs.includes(item.id)}
          data-id={item.id}
          data-type="b"
          draggable="true"
          on:dragstart={handleDragStart}
          on:dragover={handleDragOver}
          on:dragleave={handleDragEnd}
          on:dragend={handleDragEnd}
          on:drop={handleDrop}
        >
          {item.value}
        </div>
      </div>
    {/each}
  </div>
</div>

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
