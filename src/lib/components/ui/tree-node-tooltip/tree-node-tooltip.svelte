<script lang="ts">
	import type { TreeNodeData } from '$lib';
	import { base } from '$app/paths';
	import { sanitizeString } from '$lib/utils';

	let {
		node,
		showKeywordDetails,
		showSkillDetails
	}: {
		node: TreeNodeData;
		showKeywordDetails: Boolean;
		showSkillDetails: Boolean;
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
				<p class="m-0 font-light text-[#9090ff]">{@html sanitizeString(description)}</p>
			{/each}
		</div>
		<footer class="italic">
			<span class="text-[#888] text-xs float-right">{node.id}</span>
		</footer>
	</div>
</div>
{#if showSkillDetails && node.skills}
	{#each node.skills as skill}
		<div
			class="hidden md:grid bg-[#0f0f0f] w-[400px] border-2 border-[#595343] p-[10px] text-cyan-200 gap-2"
			style="font-family: 'Fontin', sans-serif"
		>
			<header class="relative text-2xl rounded-xl grid items-center" style="">
				<h1 class="whitespace-nowrap relative z-20 text-center px-12">
					{skill.name} <span class="text-cyan-200 text-sm font-medium"></span>
				</h1>
			</header>

			<p class="m-0 font-light text-[#7d7aad]">{@html sanitizeString(skill.description)}</p>
		</div>
	{/each}
{/if}
{#if showKeywordDetails && node.keywords}
	{#each node.keywords as keyword}
		<div
			class="hidden md:grid bg-[#0f0f0f] w-[400px] border-2 border-[#595343] p-[10px] text-orange-200 gap-2"
			style="font-family: 'Fontin', sans-serif"
		>
			<header class="relative text-2xl rounded-xl grid items-center" style="">
				<h1 class="whitespace-nowrap relative z-20 text-center px-12">
					{keyword.name} <span class="text-orange-200 text-sm font-medium"></span>
				</h1>
			</header>

			<p class="m-0 font-light text-[#7d7aad]">{@html sanitizeString(keyword.description)}</p>
		</div>
	{/each}
{/if}
