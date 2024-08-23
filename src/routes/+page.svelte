<script>
  import { games } from "$lib/games";
  import ModeSwitch from "$lib/components/ModeSwitch.svelte";
  import { isEasyMode } from "$lib/stores/preferences";
</script>

<div class="min-h-svh flex flex-col justify-center items-center gap-10 py-14 sm:py-20">
  <div class="max-w-[35rem] flex flex-col items-center gap-8">
    <h1 class="text-2xl font-semibold flex items-center gap-1">
      10
      <svg width="100%" height="100%" viewBox="0 0 44 43" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;" class="size-12">
          <path d="M7.63,5.632C6.988,6.968 5.606,7.894 4.007,7.894C1.795,7.894 0,6.125 0,3.947C0,1.769 1.795,0 4.007,0C6.093,0 7.808,1.573 7.996,3.58C10.677,4.501 12.975,6.335 15.031,8.737C17.534,11.663 19.682,15.443 21.783,19.329C22.091,19.125 22.501,19.09 22.852,19.274C23.359,19.539 23.552,20.159 23.283,20.659C23.152,20.902 23.021,21.145 22.89,21.389C25.108,25.521 27.335,29.621 29.987,32.721C31.703,34.725 33.593,36.307 35.797,37.146C36.44,35.81 37.822,34.885 39.421,34.885C41.632,34.885 43.428,36.653 43.428,38.831C43.428,41.01 41.632,42.778 39.421,42.778C37.335,42.778 35.62,41.205 35.431,39.198C32.751,38.278 30.453,36.444 28.397,34.041C25.8,31.006 23.586,27.052 21.41,23.014C21.24,23.017 21.066,22.979 20.905,22.895C20.398,22.631 20.204,22.01 20.472,21.51C20.494,21.47 20.516,21.43 20.538,21.389C18.32,17.257 16.093,13.158 13.44,10.058C11.725,8.053 9.834,6.471 7.63,5.632ZM39.421,0C41.632,0 43.428,1.769 43.428,3.947C43.428,6.125 41.632,7.894 39.421,7.894C37.21,7.894 35.414,6.125 35.414,3.947C35.414,1.769 37.21,0 39.421,0ZM4.007,34.885C6.218,34.885 8.013,36.653 8.013,38.831C8.013,41.01 6.218,42.778 4.007,42.778C1.795,42.778 0,41.01 0,38.831C0,36.653 1.795,34.885 4.007,34.885ZM32.958,4.741C33.448,4.447 34.088,4.6 34.387,5.082C34.686,5.565 34.531,6.196 34.041,6.49C33.5,6.816 32.978,7.187 32.472,7.598C32.03,7.958 31.374,7.896 31.008,7.46C30.643,7.024 30.705,6.378 31.148,6.018C31.731,5.544 32.333,5.116 32.958,4.741ZM28.103,9.087C28.465,8.649 29.121,8.584 29.566,8.941C30.011,9.298 30.077,9.944 29.714,10.382C29.298,10.885 28.893,11.412 28.495,11.96C28.162,12.42 27.512,12.527 27.045,12.198C26.578,11.87 26.469,11.23 26.803,10.77C27.226,10.185 27.659,9.623 28.103,9.087ZM24.496,14.28C24.79,13.794 25.429,13.635 25.922,13.924C26.415,14.213 26.577,14.842 26.283,15.328C25.937,15.902 25.595,16.487 25.256,17.08C24.975,17.573 24.34,17.748 23.84,17.471C23.339,17.194 23.162,16.568 23.443,16.076C23.79,15.468 24.141,14.868 24.496,14.28ZM18.51,25.101C18.789,24.606 19.422,24.427 19.924,24.701C20.426,24.975 20.608,25.599 20.33,26.094C19.987,26.703 19.642,27.304 19.292,27.895C19.003,28.384 18.366,28.549 17.87,28.264C17.374,27.98 17.206,27.352 17.495,26.864C17.837,26.285 18.175,25.697 18.51,25.101ZM15.324,30.268C15.649,29.802 16.297,29.683 16.77,30.004C17.243,30.324 17.363,30.962 17.038,31.428C16.627,32.017 16.207,32.587 15.777,33.132C15.425,33.578 14.771,33.659 14.318,33.312C13.865,32.965 13.782,32.321 14.134,31.875C14.54,31.361 14.936,30.823 15.324,30.268ZM11.455,34.757C11.882,34.38 12.54,34.415 12.923,34.836C13.306,35.257 13.271,35.905 12.843,36.282C12.282,36.778 11.703,37.23 11.104,37.634C10.63,37.953 9.982,37.832 9.658,37.366C9.335,36.899 9.457,36.261 9.93,35.942C10.456,35.588 10.963,35.192 11.455,34.757Z" style="fill:currentColor;"/>
      </svg>
      Training
    </h1>
    <p class="text-lg text-center text-balance font-semibold">
      Verbinde die Paare und lerne spielerisch!
    </p>
  </div>
  <div class="container">
    <div class="flex flex-col items-center gap-4">
      <ModeSwitch />
      <p class="text-center text-balance text-xs">
        {#if $isEasyMode}
          Im Easy Mode können keine Highscores eingetragen werden.
        {:else}
          Zeig, was du drauf hast und trage deine Highscores ein!
        {/if}
      </p>
    </div>
  </div>
  <div class="container">
    <div class="w-full grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-4">
      {#each games as game}
        <div class="text-center flex flex-col gap-4 bg-secondary/10 p-6 rounded-xl">
          <h2 class="text-lg text-balance font-semibold leading-3">{game.name}</h2>
          <p class="text-sm text-pretty">{game.description}</p>
          <div class="mt-auto mx-auto flex gap-2">
            <a href="{`/play/${game.slug}`}" class="button">Spielen</a>
            <a href="{`/leaderboard/${game.slug}`}" class="button">Leaderboard</a>
          </div>
        </div>
      {/each}
    </div>
  </div>
  <div class="container">
    <div class="text-sm text-center flex flex-col gap-2">
      Made with ❤️  by Nico Heinrich &copy; {new Date().getFullYear()} 
      <div>
        <a href="/imprint" class="underline">Impressum</a>
        <a href="/privacy" class="underline">Datenschutz</a>
      </div>
    </div>
  </div>
</div>
