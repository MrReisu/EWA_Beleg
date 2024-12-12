<script type="ts">
    import { slide, fly } from 'svelte/transition';
    import { quintIn, quintOut } from 'svelte/easing';
</script>

<div in:fly={{ delay: 400, duration: 400, easing: quintOut, y: "100%"}} out:fly={{ duration: 400, easing: quintIn, x: "100%"}}>
    <slot></slot>
</div>