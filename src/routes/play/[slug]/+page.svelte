<script>
  import { scale } from "svelte/transition";
  import { page } from "$app/stores";
  import { games } from "$lib/games";
  import ScoreDisplay from '$lib/components/ScoreDisplay.svelte';
  import Pairs from '$lib/components/Pairs.svelte';
  import Timer from '$lib/components/Timer.svelte';
  import Modal from "$lib/components/Modal.svelte";
  import { onMount } from 'svelte';
  import matchSoundSrc from '$lib/sounds/match.wav';
  import levelSoundSrc from '$lib/sounds/level.wav';
  import wonSoundSrc from '$lib/sounds/won.wav';
  import lostSoundSrc from '$lib/sounds/lost.wav';
  import { isEasyMode } from '$lib/stores/preferences';

  const soundCollection = [
    { name: 'match', src: matchSoundSrc },
    { name: 'level', src: levelSoundSrc },
    { name: 'won', src: wonSoundSrc },
    { name: 'lost', src: lostSoundSrc },
  ]

  let sounds = {}; 

  let isPlaying = false;
  let hasEnded = false;
  let score = 0;
  let level = 1;
  let repeated = 0;
  let lifes = 3;
  let pairs = null;
  let timer;
  let askBeforeLeaveDialog;
  let isShaking = false;

  console.log($page.params.name)

  const allPairs = games.find(game => game.slug === $page.params.slug).pairs[$isEasyMode ? "easy" : "all"];

  function handleRoundEnd() {
    isPlaying = false;

    if (repeated < 2) {
      repeated++;
    } else {
      repeated = 0;
      level++;

      sounds.level.play();
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

    sounds.match.play();
  }

  function restart() {
    score = 0;
    level = 1;
    repeated = 0;
    lifes = 3;
    hasEnded = false;
    setUp();
  }

  function handleGameEnd() {
    hasEnded = true;
    timer?.stop();

    if (lifes === 0 || score < 1) {
      sounds.lost.play();
    } else {
      sounds.won.play();
    }
  }

  function openAskBeforeLeaveDialog() {
    timer?.stop();
    askBeforeLeaveDialog.open();
  }

  onMount(setUp);
</script>

{#if hasEnded}
  <!-- Pause / End Screen -->
  <div
    class="h-screen flex justify-center items-center p-16"
  >
    <div class="flex flex-col items-center text-center space-y-8">
      {#if lifes === 0 || score < 1}
        <!-- Lost Screen -->
        <div class="space-y-4">
          <h1 class="text-4xl font-bold">Oh snap!</h1>
          <p>Looks like you lost all your lifes.</p>
        </div>
      {:else}
        <!-- Won Screen -->
        <div class="space-y-4">
          <h1 class="text-4xl font-bold">Wohoo!</h1>
          <p>You've completed the game with a score of {score}!</p>
        </div>
      {/if}
      <div class="w-40 flex flex-col gap-2">
        <button class="button" on:click={restart}>Restart</button>
        <a href="/" class="button">Menu</a>
      </div>
    </div>
  </div>
{:else}
<!-- Game Screen -->
  <div class="overflow-hidden">
    <div
      class="h-screen flex flex-col"
      class:is-shaking={isShaking}
    >
      <header class="flex justify-between items-center gap-4 p-4">
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
        <Timer minutes="1" onEnd={handleGameEnd} bind:this={timer} />
        <button on:click={openAskBeforeLeaveDialog}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
            <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z" clip-rule="evenodd" />
          </svg>
        </button>
      </header>
      {#if isPlaying}
        <div class="h-full flex justify-center items-center overflow-hidden px-4">
          <Pairs {pairs} onMatch={addToScore} onMismatch={removeLife} onEnd={handleRoundEnd} />
        </div>
      {/if}
    </div>
  </div>
{/if}

<!-- Ask Before Leave Dialog -->
<Modal bind:this={askBeforeLeaveDialog} onClose={timer?.start}>
  <h2 class="text-xl font-bold">Are you sure you want to leave?</h2>
  <p>Your achievements will be lost!</p>
  <div class="flex justify-end gap-2 mt-4">
    <button class="button">No, resume</button>
    <a href="/" class="button">Yes</a>
  </div>
</Modal>

<!-- Sounds -->
{#each soundCollection as sound}
  <audio src={sound.src} bind:this={sounds[sound.name]} preload="auto" />
{/each}

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
