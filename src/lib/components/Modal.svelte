<script>
  let modal;

  export let onClose = () => {};

  export function open() {
    modal.showModal();
  }

  export function close() {
    modal.close();
  }
</script>

<dialog
  class="bg-primary text-secondary ring-2 ring-secondary p-4 rounded-lg"
  bind:this={modal}
  on:close={onClose}
>
  <form method="dialog" class="max-w-96">
    <slot />
  </form>
</dialog>
