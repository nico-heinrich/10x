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

      if (milliseconds < 0) {
        milliseconds = 99;
        seconds--;
      }

      if (seconds < 0) {
        seconds = 59;
        minutes--;
      }

      if (minutes < 0) {
        clearInterval(interval);
        onEnd();

        minutes = 0;
        seconds = 0;
        milliseconds = 0;
      }
    }, 1);
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
