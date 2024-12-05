<script lang="ts">
	import '../app.pcss';
	let { children } = $props();
</script>

{@render children()}

<style>
	:global(body) {
		margin: 0;
		background-color: black;
		color: #e4dfd7;
		font-family: 'Fontin', sans-serif;
	}
</style>
