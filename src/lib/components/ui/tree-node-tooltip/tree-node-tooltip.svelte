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
				<p class="m-0 font-light text-[#7d7aad]">{@html description}</p>
			{/each}
		</div>
		<footer class="italic">
			<span class="text-[#888] text-xs float-right">{node.id}</span>
		</footer>
	</div>
</div>
{#if node.skills}
	{#each node.skills as skill}
		<div class="flex flex-col bg-black z-[1000] rounded-xl opacity-90 shadow-2xl">
			<header class="relative text-2xl aspect-[999/131] rounded-xl" style="">
				<img src="{base}/tooltip-header.png" alt="header" />
				<div class="absolute inset-0 bg-cyan-500 mix-blend-color pointer-events-none"></div>
				<h1
					class="whitespace-nowrap absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-200"
				>
					Skill: {skill.name}
					<span class="text-cyan-200 text-sm font-medium">{skill.type}</span>
				</h1>
			</header>
			<div class="p-4 pb-2 space-y-2">
				<div>
					{#each skill.description as description}
						{#if skill}
							<p class="m-0 font-light text-[#7d7aad]">{@html description}</p>
						{:else}
							<p class="m-0 font-light text-[#7d7aad]">{@html description}</p>
						{/if}
					{/each}
				</div>
				<footer class="italic">
					<span class="text-[#888] text-xs float-right">{node.id}</span>
				</footer>
			</div>
		</div>
	{/each}
{/if}
{#if node.keywords}
	{#each node.keywords as keyword}
		<div class="flex flex-col bg-black z-[1000] rounded-xl opacity-90 shadow-2xl">
			<header class="relative text-2xl aspect-[999/131] rounded-xl" style="">
				<img src="{base}/tooltip-header.png" alt="header" />
				<div class="absolute inset-0 bg-orange-500 mix-blend-color pointer-events-none"></div>
				<h1
					class="whitespace-nowrap absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-orange-200"
				>
					{keyword.name}
				</h1>
			</header>
			<div class="p-4 pb-2 space-y-2">
				<div>
					{#each keyword.description as description}
						<p class="m-0 font-light text-[#7d7aad]">{description}</p>
					{/each}
				</div>
				<footer class="italic">
					<span class="text-[#888] text-xs float-right">{node.id}</span>
				</footer>
			</div>
		</div>
	{/each}
{/if}
