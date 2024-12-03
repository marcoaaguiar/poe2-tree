<script lang="ts">
	import type { TreeNodeData } from '$lib';
	import { base } from '$app/paths';

	let {
		node
	}: {
		node: TreeNodeData;
	} = $props();
</script>

<div class="flex flex-col bg-black z-[1000] rounded-xl opacity-90 shadow-2xl">
	<header class="relative text-2xl aspect-[999/131] rounded-xl" style="">
		<img src="{base}/tooltip-header.png" alt="header" />
		<h1 class="whitespace-nowrap absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
			{node.name}
		</h1>
	</header>
	<div class="p-4 pb-2 space-y-2">
		<div>
			{#each node.description as description}
				<p class="m-0 font-light text-[#7d7aad]">{description}</p>
			{/each}
		</div>
		<footer class="italic">
			<span class="text-[#888] text-xs float-right">{node.id}</span>
		</footer>
	</div>
</div>
