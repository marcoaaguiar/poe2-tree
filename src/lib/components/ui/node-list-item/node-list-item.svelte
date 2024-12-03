<script lang="ts">
	export let nodeId: string;
	export let nodes: Record<
		string,
		{
			name: string;
			description: string[];
		}
	>;
	export let onClick: (nodeId: string) => void;

	function handleClick() {
		if (onClick) {
			onClick(nodeId);
		}
	}

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

<button
	onclick={handleClick}
	class="cursor-pointer hover:bg-slate-400/15 w-full transition-color duration-300"
	title={nodes[nodeId].name}
>
	<strong class={getTitleColor(nodeId)}>{nodes[nodeId].name}</strong>
	<ul>
		{#each nodes[nodeId].description as description}
			<li class="text-sm text-[#7d7aad]">{description}</li>
		{/each}
	</ul>
</button>
