<script>
  import { games } from "$lib/games";
  import ModeSwitch from "$lib/components/ModeSwitch.svelte";
</script>

<div class="min-h-screen flex flex-col justify-center items-center gap-6 py-14 sm:py-20">
  <div class="flex gap-4">
    <h1 class="text-2xl font-semibold">10X Training</h1>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
        <path fill-rule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 0 1 .75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 0 1 9.75 22.5a.75.75 0 0 1-.75-.75v-4.131A15.838 15.838 0 0 1 6.382 15H2.25a.75.75 0 0 1-.75-.75 6.75 6.75 0 0 1 7.815-6.666ZM15 6.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" clip-rule="evenodd" />
        <path d="M5.26 17.242a.75.75 0 1 0-.897-1.203 5.243 5.243 0 0 0-2.05 5.022.75.75 0 0 0 .625.627 5.243 5.243 0 0 0 5.022-2.051.75.75 0 1 0-1.202-.897 3.744 3.744 0 0 1-3.008 1.51c0-1.23.592-2.323 1.51-3.008Z" />
      </svg>
  </div>
  <div class="flex flex-col items-center gap-4 p-4">
    <ModeSwitch />
    <p class="text-center text-balance text-xs">Highscores can be submitted in 10x mode only!</p>
  </div>
  <div class="container">
    <div class="w-full grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-4">
      {#each games as game}
        <div class="text-center flex flex-col gap-4 bg-secondary/10 p-6 rounded-xl">
          <h2 class="text-lg text-balance font-semibold leading-3">{game.name}</h2>
          <p class="text-sm text-pretty">{game.description}</p>
          <div class="mt-auto mx-auto flex gap-2">
            <a href="{`/play/${game.slug}`}" class="button">Play</a>
            <a href="{`/leaderboard/${game.slug}`}" class="button">Leaderboard</a>
          </div>
        </div>
      {/each}
    </div>
  </div>
  <p class="text-sm">
    Made with ❤️  by Nico Heinrich &copy; {new Date().getFullYear()} |
    <a href="/imprint" class="underline">Imprint</a>
    <a href="/privacy" class="underline">Privacy</a>
  </p>
</div>
