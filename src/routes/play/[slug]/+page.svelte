<script>
  import { scale } from "svelte/transition";
  import { page } from "$app/stores";
  import { games } from "$lib/games";
  import ScoreDisplay from '$lib/components/ScoreDisplay.svelte';
  import Pairs from '$lib/components/Pairs.svelte';
  import Timer from '$lib/components/Timer.svelte';
  import Modal from "$lib/components/Modal.svelte";
  import AudioFX from "$lib/components/AudioFX.svelte";
  import { onMount } from 'svelte';
  import { isEasyMode, userName } from '$lib/stores/preferences';
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';

  export let form;
  let isFormLoading = false;

  let isPlaying = false;
  let hasEnded = false;
  let score = 0;
  let level = 1;
  let repeated = 0;
  let lifes = 3;
  let pairs = null;
  let timer;
  let askBeforeLeaveDialog;
  let submitHighscoreDialog;
  let isShaking = false;
  let ranking = null;

  let audioFX;

  const gameName = games.find(game => game.slug === $page.params.slug).name;
  const allPairs = games.find(game => game.slug === $page.params.slug).pairs[$isEasyMode ? "easy" : "tenx"];

  function handleRoundEnd() {
    isPlaying = false;

    if (repeated < 2) {
      repeated++;
    } else {
      repeated = 0;
      level++;

      audioFX.play("level");
    }

    setUp();
  }

  function shakeScreen() {
    if (isShaking) return;

    isShaking = true;

    setTimeout(() => {
      isShaking = false;
    }, 300);
  }

  function getRandomPairs(count, pairs) {
    return pairs.sort(() => Math.random() - 0.5).slice(0, count);
  }

  function setUp() {
    switch (level) {
      case 1:
        pairs = getRandomPairs(2, allPairs);
        break;
      case 2:
        pairs = getRandomPairs(4, allPairs);
        break;
      case 3:
        pairs = getRandomPairs(6, allPairs);
        break;
      case 4:
        pairs = getRandomPairs(8, allPairs);
        break;
      default:
        pairs = getRandomPairs(8, allPairs);
        break;
    }

    requestAnimationFrame(() => {
      isPlaying = true;
    });
  }

  function removeLife() {
    lifes--;

    shakeScreen();

    if (lifes === 0) handleGameEnd();
  }

  function addToScore() {
    score += 10;

    audioFX.play("match");
  }

  function restart() {
    score = 0;
    level = 1;
    repeated = 0;
    lifes = 3;
    hasEnded = false;
    form = null;
    ranking = null;
    setUp();
  }

  async function handleGameEnd() {
    timer?.stop();

    if (lifes === 0 || score < 1) {
      audioFX.play("lost");
    } else {
      if (!$isEasyMode) await updateRanking();
      audioFX.play("won");

      if (ranking !== null && ranking <= 10) {
        setTimeout(() => {
          submitHighscoreDialog.open();
        }, 1000);
      }
    }

    hasEnded = true;
  }

  function openAskBeforeLeaveDialog() {
    if (score === 0) {
      goto("/");

      return;
    }

    timer?.stop();
    askBeforeLeaveDialog.open();
  }

  async function updateRanking() {
    const res = await fetch(`/api/leaderboard/${$page.params.slug}`);
    const data = await res.json();

    if (data.length < 10) {
      ranking = data.length + 1;
      return;
    }

    ranking = data.findIndex(item => item.score < score) + 1;
  }

  function getPostiveReaction() {
    const reactions = {
      mild: ["Gut gemacht!", "Weiter so!", "Nicht schlecht!"],
      medium: ["Super!", "Fantastisch!", "Perfekt!"],
      high: ["Wahnsinn!", "Unglaublich!", "Genial!"],
    }

    const intensity = score < 50 ? "mild" : score < 100 ? "medium" : "high";

    return reactions[intensity][Math.floor(Math.random() * reactions[intensity].length)];
  }

  function handleSecondPassed(seconds) {
    console.log(seconds);
    if (seconds === 3) {
      audioFX.play("clock");
    }
  }

  onMount(setUp);
</script>

{#if hasEnded}
  <!-- Pause / End Screen -->
  <div
    class="h-svh flex justify-center items-center p-4"
    style="padding-bottom: env(safe-area-inset-bottom);"
  >
    <div class="flex flex-col items-center text-center space-y-8">
      {#if lifes === 0 || score < 1}
        <!-- Lost Screen -->
        <div class="space-y-4">
          <h1 class="text-4xl font-bold">Game Over</h1>
          {#if lifes === 0}
            <p class="text-balance">Dir sind die Leben ausgegangen!</p>
          {:else if score < 1}
            <p class="text-balance">Bist du eingeschlafen?</p>
          {/if}
        </div>
      {:else}
        <!-- Won Screen -->
        <div class="space-y-4">
          <h1 class="text-4xl font-bold">{getPostiveReaction()}</h1>
          {#if (!$isEasyMode && ranking)}
            <p class="text-balance">Du hast mit {score} Punkten den {ranking}. Platz erreicht!</p>
            {#if form?.success}
              <p class="text-balance font-semibold">Dein Highscore wurde veröffentlicht.</p>
            {/if}
          {:else}
            <p>Du hast {score} Punkte erreicht!</p>
          {/if}
        </div>
      {/if}
      <div class="w-60 flex flex-col gap-2">
        <button class="button" on:click={restart}>Nochmal spielen</button>
        <a href="/" class="button">Home</a>
      </div>
    </div>
  </div>
{:else}
<!-- Game Screen -->
  <div class="overflow-hidden">
    <div
      class="h-svh flex flex-col"
      class:is-shaking={isShaking}
      style="padding-bottom: env(safe-area-inset-bottom);"
    >
      <header class="fixed left-0 right-0 flex justify-between items-center gap-4 p-4 z-10">
        <button on:click={openAskBeforeLeaveDialog} class="icon-button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
            <path fill-rule="evenodd" d="M17 4.25A2.25 2.25 0 0 0 14.75 2h-5.5A2.25 2.25 0 0 0 7 4.25v2a.75.75 0 0 0 1.5 0v-2a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 .75.75v11.5a.75.75 0 0 1-.75.75h-5.5a.75.75 0 0 1-.75-.75v-2a.75.75 0 0 0-1.5 0v2A2.25 2.25 0 0 0 9.25 18h5.5A2.25 2.25 0 0 0 17 15.75V4.25Z" clip-rule="evenodd" />
            <path fill-rule="evenodd" d="M14 10a.75.75 0 0 0-.75-.75H3.704l1.048-.943a.75.75 0 1 0-1.004-1.114l-2.5 2.25a.75.75 0 0 0 0 1.114l2.5 2.25a.75.75 0 1 0 1.004-1.114l-1.048-.943h9.546A.75.75 0 0 0 14 10Z" clip-rule="evenodd" />
          </svg>
        </button>
        <ScoreDisplay {score} />
        <div class="flex flex-row-reverse gap-1 ml-auto">
          {#each Array(lifes) as _, index (index)}
            <svg
              out:scale={{ duration: 300, start: .5 }}
              key={index}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              class="size-5"
            >
              <path d="m9.653 16.915-.005-.003-.019-.01a20.759 20.759 0 0 1-1.162-.682 22.045 22.045 0 0 1-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 0 1 8-2.828A4.5 4.5 0 0 1 18 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 0 1-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 0 1-.69.001l-.002-.001Z" />
            </svg>
          {/each}
        </div>
        <Timer minutes="0" seconds="10" onEnd={handleGameEnd} onSecondPassed={handleSecondPassed} bind:this={timer} />
      </header>
      {#if isPlaying}
        <div class="h-full flex justify-center items-center overflow-hidden">
          <Pairs {pairs} onMatch={addToScore} onMismatch={removeLife} onEnd={handleRoundEnd} />
        </div>
      {/if}
      <footer
        class="fixed left-0 bottom-0 right-0 flex justify-center items-center gap-4 p-4 z-10 text-secondary/50"
        style="padding-bottom: max(1rem, env(safe-area-inset-bottom));"
      >
        {gameName}
      </footer>
    </div>
  </div>
{/if}

<!-- Ask Before Leave Dialog -->
<Modal bind:this={askBeforeLeaveDialog} onClose={timer?.start}>
  <div class="space-y-4">
    <div class="space-y-2">
      <h2 class="text-xl text-balance font-semibold">Willst du das Spiel beenden?</h2>
      <p class="text-balance">Dein aktueller Fortschritt geht dabei verloren.</p>
    </div>
    <div class="flex flex-col gap-2">
      <a href="/" class="button block">Ja, beenden</a>
      <button class="button ">Weiterspielen</button>
    </div>
  </div>
</Modal>

<!-- Submit Highscore Dialog -->
<Modal bind:this={submitHighscoreDialog}>
  <form method="POST" action="?/submit" use:enhance={() => {
    isFormLoading = true;
    return async ({ update, result }) => {
      await update();

      isFormLoading = false;
      if (result?.type === "success") {
        submitHighscoreDialog.close();
      }
    }
  }}>
    <input type="hidden" name="score" value={score}>
    <input type="hidden" name="game" value={$page.params.slug}>
    <div class="space-y-4">
      <div class="space-y-2">
        <h2 class="text-xl text-balance font-semibold">Herzlichen Glückwunsch!</h2>
        <p class="text-pretty">Trage einen Namen ein, um deinen Highscore zu veröffentlichen:</p>
      </div>
      <div class="space-y-2">
        <input type="text" name="name" value={form?.name || $userName} placeholder="Dein Name" disabled={isFormLoading} class="w-full border-b-2 border-secondary outline-none py-2 placeholder:text-secondary/30 font-semibold">
        <label class="block text-sm">
          <input
            type="checkbox"
            name="terms"
            id="terms"
            class="accent-secondary size-4 translate-y-0.5"
            disabled={isFormLoading}
          >
          <span>Ich habe die <a href="/privacy" target="_blank" class="underline">Datenschutz&shy;erklärung</a> gelesen und bin einverstanden.</span>
        </label>
        {#if form?.error}
          <div class="text-error text-sm">{form.error}</div>
        {/if}
      </div>
      <div class="flex flex-col gap-2">
        <button type="submit" disabled={isFormLoading} class="button w-full flex justify-center items-center">
          {#if isFormLoading}
            <div class="size-5 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
          {:else}
            Veröffentlichen
          {/if}
        </button>
        <button type="button" on:click={submitHighscoreDialog.close} disabled={isFormLoading} class="button w-full">Abbrechen</button>
      </div>
    </div>
  </form>
</Modal>

<AudioFX bind:this={audioFX} />

<style>
  .is-shaking {
    animation: shake .3s;
  }

  @keyframes shake {
    0% {
      transform: translateX(0%);
    }
    10% {
      transform: translateX(-1px);
    }
    20% {
      transform: translateX(1px);
    }
    30% {
      transform: translateX(-2px);
    }
    40% {
      transform: translateX(2px);
    }
    50% {
      transform: translateX(-2px);
    }
    60% {
      transform: translateX(2px);
    }
    70% {
      transform: translateX(-1px);
    }
    80% {
      transform: translateX(1px);
    }
    90% {
      transform: translateX(-1px);
    }
    100% {
      transform: translateX(0%);
    }
  }
</style>
