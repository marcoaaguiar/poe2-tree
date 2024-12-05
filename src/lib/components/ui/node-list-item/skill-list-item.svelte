<script lang="ts">
	import type { SkillBlinker } from '$lib';

	export let skill: SkillBlinker;
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

<strong class={`text-green-100 ${skill.blinking ? 'blink' : ''}`}>{skill.name}</strong>
<ul>
	{#each skill.description as description}
		<li class="text-sm text-[#7d7aad]">{description}</li>
	{/each}
</ul>
From:
{#each skill.nodes as nodeId}
	<button
		onclick={() => onClick(nodeId)}
		class="cursor-pointer hover:bg-slate-400/15 w-full transition-color duration-300 {getTitleColor(
			nodeId
		)}"
		title={skill.name}
	>
		{nodes[nodeId].name}
	</button>
{/each}

<style>
	.blink {
		animation: blink-animation 0.5s ease-in-out infinite alternate;
	}

	@keyframes blink-animation {
		from {
			opacity: 1;
		}
		to {
			opacity: 0.3;
		}
	}
</style>
