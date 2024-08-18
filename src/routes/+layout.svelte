<script>
  import "../app.css";
  import { db } from "$lib/db";
  import { isEasyMode, userName } from "$lib/stores/preferences";
  import { onMount } from "svelte";

  onMount(async () => {
    const setting = await db.preferences.get("isEasyMode");
    const name = await db.preferences.get("userName");

    if (setting) {
      $isEasyMode = setting.value;
    }

    if (name) {
      $userName = name.value;
    }
  });
</script>

<slot />
