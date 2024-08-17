<script>
  export let onConnectStart = () => {};
  export let onConnectEnd = () => {};
  export let onConnectHover = () => {};

  let container;

  let isPointerDown = false;
  let currentStartTarget = null;
  let currentId = 0;
  let lines = [];
  let isConnectable = false;

  function handlePointerdown(event) {
    isPointerDown = true;

    const target = event.target.closest("[data-connect]");
    currentStartTarget = target;

    if (!target) return;

    onConnectStart(target);
 
    const boundingRect = container.getBoundingClientRect();
    const x1 = event.clientX - boundingRect.left;
    const y1 = event.clientY - boundingRect.top;
    const id = Date.now();
    currentId = id;

    lines = [...lines, { x1, y1, x2: x1, y2: y1, id, transitionOut: false }];
  }

  function handlePointerup(event) {
    isPointerDown = false;

    const target = document.elementFromPoint(event.clientX, event.clientY).closest("[data-connect]");

    onConnectEnd(target);

    if (target && target !== currentStartTarget && isConnectable) {
      removeLine(currentId);
    } else {
      removeLine(currentId, true);
    }

    currentStartTarget = null;
    currentId = 0;
  }

  function handlePointermove(event) {
    if (!isPointerDown) return;

    const target = document.elementFromPoint(event.clientX, event.clientY).closest("[data-connect]");

    if (target && target.dataset.connect !== currentStartTarget.dataset.connect) {
      isConnectable = target !== currentStartTarget;
    } else {
      isConnectable = false;
    }

    onConnectHover(target);

    const boundingRect = container.getBoundingClientRect();
    const x2 = event.clientX - boundingRect.left;
    const y2 = event.clientY - boundingRect.top;

    lines = lines.map((line) => {
      if (line.id === currentId) {
        return { ...line, x2, y2 };
      }

      return line;
    });
  }

  function handlePointerLeave() {
    isPointerDown = false;

    removeLine(currentId, true);
  }

  function removeLine(id, immediate = false) {
    if (immediate) {
      lines = lines.filter((line) => line.id !== id);
      return;
    }

    lines = lines.map((line) => {
      if (line.id === id) {
        return { ...line, transitionOut: true };
      }

      return line;
    });

    setTimeout(() => {
      lines = lines.filter((line) => line.id !== id);
    }, 300);
  }
</script>

<div
  bind:this={container}
  on:pointerdown={handlePointerdown}
  on:pointermove={handlePointermove}
  on:pointerup={handlePointerup}
  on:pointerleave={handlePointerLeave}
>
  <svg xmlns="http://www.w3.org/2000/svg" class="text-secondary">
    {#each lines as { x1, y1, x2, y2, transitionOut }, id}
      <line
        key={id}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-dasharray={isConnectable ? "0" : "5"}
        class:transition-out={transitionOut}
      />
    {/each}
  </svg>
  <slot />
</div>

<style>
  div {
    width: 100%;
    height: 100%;
    position: relative;
    touch-action: none;
  }

  svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
  }

  .transition-out {
    opacity: 0;
    transition: all 300ms ease-out;
  }
</style>
