<script>
  import { fly } from "svelte/transition";

  export let score = 0;
</script>

  <div class="flex gap-2">
  <span class="font-semibold">Score:</span>
    <div class="w-10 relative overflow-hidden">
      {#key score}
        <div
          class="absolute"
          in:fly={{ y: "100%", opacity: 1, duration: 500 }}
        out:fly={{ y: "-100%", opacity: 1, duration: 500 }}
        >
          {score}
        </div>
      {/key}
    </div>
  </div>
