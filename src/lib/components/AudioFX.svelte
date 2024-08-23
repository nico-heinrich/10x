<script>
    import clockSound from '$lib/assets/audio/clock.wav';
    import matchSound from '$lib/assets/audio/match.wav';
    import wonSound from '$lib/assets/audio/won.wav';
    import lostSound from '$lib/assets/audio/lost.wav';
    import levelSound from '$lib/assets/audio/level.wav';

    const sources = {
      clock: clockSound,
      match: matchSound,
      won: wonSound,
      lost: lostSound,
      level: levelSound
    }

    export function play(sound) {
        const audio = new Audio(sources[sound]);

        audio.play();
    }
</script>

{#each Object.values(sources) as src}
    <audio {src} preload="auto" />
{/each}
