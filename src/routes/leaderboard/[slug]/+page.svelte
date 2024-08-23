<script>
  import { page } from "$app/stores";
  import { games } from "$lib/games";
  import { onMount } from "svelte";

  let gameName = games.find(game => game.slug === $page.params.slug).name;

  let topTen = [];

  async function getTopTen() {
    const res = await fetch(`/api/leaderboard/${$page.params.slug}`);
    const data = await res.json();

    topTen = Array(10).fill({})
      .map((_, i) => data[i] || { name: "-", score: "-" });
  }

  onMount(getTopTen);
</script>

<div class="h-svh flex flex-col justify-center gap-6" style="padding-bottom: env(safe-area-inset-bottom);">
  <div class="container">
    <div class="h-[30.5rem] space-y-4">
      <div class="flex gap-4 items-center">
        <a href="/" class="icon-button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
            <path fill-rule="evenodd" d="M17 4.25A2.25 2.25 0 0 0 14.75 2h-5.5A2.25 2.25 0 0 0 7 4.25v2a.75.75 0 0 0 1.5 0v-2a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 .75.75v11.5a.75.75 0 0 1-.75.75h-5.5a.75.75 0 0 1-.75-.75v-2a.75.75 0 0 0-1.5 0v2A2.25 2.25 0 0 0 9.25 18h5.5A2.25 2.25 0 0 0 17 15.75V4.25Z" clip-rule="evenodd" />
            <path fill-rule="evenodd" d="M14 10a.75.75 0 0 0-.75-.75H3.704l1.048-.943a.75.75 0 1 0-1.004-1.114l-2.5 2.25a.75.75 0 0 0 0 1.114l2.5 2.25a.75.75 0 1 0 1.004-1.114l-1.048-.943h9.546A.75.75 0 0 0 14 10Z" clip-rule="evenodd" />
          </svg>
        </a>
        <h1 class="text-xl font-semibold text-balance">{gameName}</h1>
      </div>
      <ol class="grid grid-cols-[1.5rem,1fr,1fr] gap-x-6">
        <li class="col-span-full grid grid-cols-subgrid font-semibold py-2 border-b-2 border-secondary">
          <div class="place-self-end">#</div>
          <div>Name</div>
          <div>Score</div>
        </li>
        {#each topTen as item, index}
          <li
            class="col-span-full grid grid-cols-subgrid py-2 {index % 2 === 0 ? 'bg-secondary/10' : ''} animate-in"
            style="animation-delay: {index * 100}ms;"
          >
            <div class="place-self-end">{index + 1}</div>
            <div>{item.name}</div>
            <div>{item.score}</div>
          </li>
        {/each}
      </ol>
    </div>
  </div>
</div>

<style>
  .animate-in {
    opacity: 0;
    transform: scaleY(0);
    animation: fadeIn 0.3s ease-in-out forwards;
  }

  @keyframes fadeIn {
    to {
      opacity: 1;
      transform: scaleY(1);
    }
  }
</style>
