<script>
  export let onConnectStart = () => {};
  export let onConnectEnd = () => {};
  export let onConnectHover = () => {};

  let container;

  let isPointerDown = false;
  let startTarget = null;
  let isConnectable = false;
  let x1, y1, x2, y2;

  function handlePointerDown(event) {
    isPointerDown = true;

    const target = event.target.closest("[data-connect]");
    startTarget = target;
    const connectFrom = target?.dataset.connect;

    if (!target) return;

    onConnectStart(target);
 
    const containerBoundingRect = container.getBoundingClientRect();
    const targetBoundingRect = target.getBoundingClientRect();
    x1 = targetBoundingRect.left + (connectFrom === "right" ? targetBoundingRect.width : 0) - containerBoundingRect.left;
    y1 = targetBoundingRect.top + targetBoundingRect.height / 2 - containerBoundingRect.top;
  }

  function handlePointerUp(event) {
    isPointerDown = false;

    const target = document.elementFromPoint(event.clientX, event.clientY)?.closest("[data-connect]");

    onConnectEnd(target, startTarget);

    removeLine();

    startTarget = null;
  }

  function handlePointerMove(event) {
    if (!isPointerDown) return;

    const target = document.elementFromPoint(event.clientX, event.clientY)?.closest("[data-connect]");

    if (target && target === startTarget) {
      console.log("same target");
      x2 = x1;
      y2 = y1;

      return;
    };

    if (target && target.dataset.connect !== startTarget.dataset.connect) {
      isConnectable = target !== startTarget;

      const containerBoundingRect = container.getBoundingClientRect();
      const targetBoundingRect = target.getBoundingClientRect();
      x2 = targetBoundingRect.left + (target.dataset.connect === "left" ? 0 : targetBoundingRect.width) - containerBoundingRect.left;
      y2 = targetBoundingRect.top + targetBoundingRect.height / 2 - containerBoundingRect.top;
    } else {
      isConnectable = false;

      const boundingRect = container.getBoundingClientRect();
      x2 = event.clientX - boundingRect.left;
      y2 = event.clientY - boundingRect.top;
    }

    onConnectHover(target);
  }

  function handlePointerLeave() {
    isPointerDown = false;

    removeLine();
  }

  function removeLine() {
    x1 = undefined;
    y1 = undefined;
    x2 = undefined;
    y2 = undefined;
    startTarget = null;
  }
</script>

<div
  bind:this={container}
  on:pointerdown={handlePointerDown}
  on:pointermove={handlePointerMove}
  on:pointerup={handlePointerUp}
  on:pointerleave={handlePointerLeave}
>
  <svg xmlns="http://www.w3.org/2000/svg" class="text-secondary">
    {#if x1 && y1 && x2 && y2}
      <path
        d="M{x1},{y1} {y1 === y2 ? `L${x2},${y2}` : `C${(x1+x2)/2},${y1} ${(x1+x2)/2},${y2} ${x2},${y2}`}"
        stroke="currentColor"
        fill="none"
        stroke-width="2"
        stroke-linecap="round"
        stroke-dasharray={isConnectable ? "0" : "1, 5"}
      />
    {/if}
    {#if isPointerDown && startTarget}
      <circle cx={x1} cy={y1} r="4" fill="currentColor" />
      <circle cx={x2 || x1} cy={y2 || y1} r="4" fill="currentColor" />
    {/if}
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

  @keyframes flow {
    0% {
      stroke-dashoffset: 0;
    }
    100% {
      stroke-dashoffset: -20;
    } 
  }
</style>
