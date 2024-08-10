<script>
  import { onMount } from "svelte";

  export let seconds = 0;
  export let minutes = 0;
  export let milliseconds = 0;
  export let onEnd = () => {};

  let interval;

  export function start() {
    interval = setInterval(() => {
      milliseconds--;

      console.log(milliseconds);

      if (milliseconds < 0) {
        seconds--;
        milliseconds = 99;
      }

      if (seconds < 0) {
        minutes--;
        seconds = 59;
      }

      if (minutes < 0) {
        clearInterval(interval);
        onEnd();
      }
    }, 10);
  }

  export function stop() {
    clearInterval(interval);
  }

  function patchTwoDigits(value) {
    return value.toString().padStart(2, "0");
  }

  onMount(start);
</script>

<div>{patchTwoDigits(minutes)}:{patchTwoDigits(seconds)}:{patchTwoDigits(milliseconds)}</div>
