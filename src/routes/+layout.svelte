<script>
  import "../app.css";
  import { db } from "$lib/db";
  import { isEasyMode } from "$lib/stores/preferences";
  import { onMount } from "svelte";

  onMount(async () => {
    const setting = await db.preferences.get("isEasyMode");

    if (setting) {
      $isEasyMode = setting.value;
    }
  });
</script>

<slot />
