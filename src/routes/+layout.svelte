<script>
	let { children } = $props();
</script>

{@render children()}

<style>
	:global(html) {
		height: 100%;
		overflow: hidden;
	}
	:global(body) {
		height: 100%;
		margin: 0;
		background-color: black;
		color: #e4dfd7;
		font-family: 'Fontin SmallCaps', sans-serif;
	}
</style>
