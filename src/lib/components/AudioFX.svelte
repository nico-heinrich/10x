<script>
    const sounds = {
        ...import.meta.glob('$lib/assets/sounds/*.mp3'),
        ...import.meta.glob('$lib/assets/sounds/*.wav'),
    };

    const sources = Object.keys(sounds);

    export function play(sound) {
        const src = sources.find((source) => source.split('/').pop().split('.').shift().toLowerCase() === sound.toLowerCase());
        const audio = new Audio(src);

        audio.play();
    }
</script>

{#each sources as src}
    <audio {src} preload="auto" />
{/each}
