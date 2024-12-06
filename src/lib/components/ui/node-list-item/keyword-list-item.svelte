<script lang="ts">
	import type { Keyword } from '$lib';
	import { sanitizeString } from '$lib/utils';

	export let keyword: Keyword;
	export let nodes: Record<
		string,
		{
			name: string;
		}
	>;
	export let onClick: (nodeId: string) => void;

	function getTitleColor(nodeId: string): string {
		const startChar = nodeId.charAt(0);
		switch (startChar) {
			case 'K':
				return 'text-green-300';
			case 'N':
				return 'text-yellow-300';
			case 'A':
				return 'text-orange-300';
			default:
				return 'text-white';
		}
	}
</script>

<strong class="text-orange-100">{keyword.name}</strong>
<p class="text-sm text-[#7d7aad]">{@html sanitizeString(keyword.description)}</p>
From:
{#each keyword.nodes as nodeId}
	<button
		onclick={() => onClick(nodeId)}
		class="cursor-pointer hover:bg-slate-400/15 w-full transition-color duration-300 {getTitleColor(
			nodeId
		)}"
		title={keyword.name}
	>
		{nodes[nodeId].name}
	</button>
{/each}
