<script lang="ts">
	import type { Keyword, Skill } from '$lib';

	export let nodeId: string;
	export let nodes: Record<
		string,
		{
			name: string;
			description: string[];
			skill?: Skill;
		}
	>;
	export let onClick: (nodeId: string) => void;
	export let handleBlinker: (element: string, type: string) => void;

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

	function handleInnerClick(event: MouseEvent) {
		const target = event.target as HTMLElement;

		const isKeyword = target.classList.contains('is-keyword');
		const isSkill = target.classList.contains('is-skill');

		const type = isKeyword ? 'keyword' : isSkill ? 'skill' : '';

		// Check if the clicked element has the specific class
		if (isKeyword || isSkill) {
			console.log('Special class clicked:', target);
			handleBlinker(target.innerText, type);
		}
	}
</script>

<button
	onclick={handleClick}
	class="cursor-pointer hover:bg-slate-400/15 w-full transition-color duration-300"
	title={nodes[nodeId].name}
>
	<strong class={getTitleColor(nodeId)}>{nodes[nodeId].name}</strong>
	<ul onclick={handleInnerClick}>
		{#each nodes[nodeId].description as description}
			<li class="text-sm text-[#7d7aad]">{@html description}</li>
		{/each}
	</ul>

	<!-- {#if nodes[nodeId].skill}
		<strong class="text-cyan-200">{nodes[nodeId].skill?.name}</strong>
		<ul>
			{#each nodes[nodeId].skill.description as description}
				<li class="text-sm text-[#7d7aad]">{description}</li>
			{/each}
		</ul>
	{/if} -->
</button>
