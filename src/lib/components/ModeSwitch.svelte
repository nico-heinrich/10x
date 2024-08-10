<script>
  import { db } from "$lib/db";
  import { isEasyMode } from "$lib/stores/preferences";

  function updateDb() {
    db.preferences.put({ setting: "isEasyMode", value: $isEasyMode });
  }

  function toggleMode() {
    $isEasyMode = !$isEasyMode;

    updateDb();
  }
</script>

<div class="flex gap-4">
  <span class:opacity-50={!$isEasyMode} class="select-none transition-opacity duration-300">Noob</span>
  <div
    class="relative w-10 h-6 ring ring-2 ring-secondary rounded-full active:bg-secondary/10 transition-all duration-300 cursor-pointer"
    on:click={toggleMode}
  >
    <div
      class="absolute top-0 bottom-0 size-5 bg-secondary rounded-full m-0.5 transition-all duration-300 ease-in-out"
      class:translate-x-4={!$isEasyMode}
      on:transitionend={updateDb}
    ></div>
  </div>
  <span class:opacity-50={$isEasyMode} class="select-none transition-opacity duration-300">10x</span>
</div>
