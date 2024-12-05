<script lang="ts">
	import type { TreeNodeData } from '$lib';
	import { base } from '$app/paths';

	let {
		node
	}: {
		node: TreeNodeData;
	} = $props();
</script>

<div
	class="grid bg-black z-[1000] opacity-90 shadow-2xl w-[400px] h-min"
	style="grid-template-rows: 52px min-content; max-width: 100svw"
>
	<header class="relative text-2xl aspect-[999/131] rounded-xl grid items-center" style="">
		<img
			class="absolute z-10 object-fill h-[52px] w-full"
			src="{base}/tooltip-header.png"
			alt="header"
		/>
		<h1 class="whitespace-nowrap relative z-20 text-center px-12">
			{node.name}
		</h1>
	</header>
	<div class="p-4 pb-2 space-y-2">
		<div class="grid">
			{#each node.description as description}
				<p class="m-0 font-light text-[#9090ff]">{description}</p>
			{/each}
		</div>
		<footer class="italic">
			<span class="text-[#888] text-xs float-right">{node.id}</span>
		</footer>
	</div>
</div>
