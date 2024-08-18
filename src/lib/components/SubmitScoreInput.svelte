<script>
  import { db } from "$lib/db";
  import { userName } from "$lib/stores/preferences";


  export let name = "";
  export let error = "";
  export let isFormLoading = false;
  export let value = "";

  function updateDb() {
    db.preferences.put({ setting: "userName", value: value});

    $userName = value;
  }
</script>

<div class="max-w-96 flex items-center border-b-2 border-secondary mx-auto">
  <!-- Input -->
  <input
    on:change={updateDb}
    type="text"
    {name}
    placeholder="Your Name"
    class="w-full bg-transparent py-1 placeholder:text-secondary/50 outline-none"
    bind:value
    autofocus
  >
{#if isFormLoading}
  <!-- Loading Spinner -->
    <div class="size-4 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
{:else}
  <!-- Submit Button -->
  <button
    type="submit"
    class="disabled:opacity-50 disabled:cursor-not-allowed"
    disabled={!value?.trim()}
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
      <path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.293-7.155.75.75 0 0 0 0-1.114A28.897 28.897 0 0 0 3.105 2.288Z" />
    </svg>
  </button>
{/if}
</div>
