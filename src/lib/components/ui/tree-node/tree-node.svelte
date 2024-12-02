<script lang="ts">
	import type { TreeNodeData } from '$lib';
	import { base } from '$app/paths';

	let {
		node,
		scale,
		baseImageRelativeSizeX,
		baseImageRelativeSizeY,
		isSearchResults,
		selected,
		highlighted,
		onmouseenter: onMouseEnter,
		onmouseleave: onMouseLeave,
		onclick: onClick
	}: {
		node: TreeNodeData;
		scale: number;
		baseImageRelativeSizeX: number;
		baseImageRelativeSizeY: number;
		isSearchResults: boolean;
		selected: boolean;
		highlighted: boolean;
		onclick: (node: TreeNodeData) => void;
		onmouseenter: (node: TreeNodeData) => void;
		onmouseleave: () => void;
	} = $props();

	const NODE_SIZE = {
		notable: 20,
		small: 10,
		keystone: 24
	};

	// calculate node size in pixels based on type
	function getNodeSize(node: TreeNodeData) {
		return NODE_SIZE[node.type];
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	class:keystone={node.type === 'keystone'}
	class:notable={node.type === 'notable'}
	class:small={node.type === 'small'}
	class:ascendancy={node.id.startsWith('A')}
	class:unidentified={node.description.length === 0}
	class:search-result={isSearchResults}
	class:selected
	class:highlighted
	style="
		height: {getNodeSize(node) * scale}px;
		width: {getNodeSize(node) * scale}px;
		left: {node.position.x * baseImageRelativeSizeX - (getNodeSize(node) * scale) / 2}px;
		top: {node.position.y * baseImageRelativeSizeY - (getNodeSize(node) * scale) / 2}px;
	"
	onmousedown={(event) => event.stopPropagation()}
	onclick={() => onClick(node)}
	onmouseenter={() => onMouseEnter(node)}
	onmouseleave={onMouseLeave}
></div>

<style lang="postcss">
	.small,
	.notable,
	.ascendancy,
	.keystone {
		position: absolute;
		border-radius: 50%;
		pointer-events: auto;
	}

	.notable {
		background-color: rgba(255, 255, 0, 0.2);
	}

	.notable.unidentified,
	.ascendancy.unidentified {
		background-color: rgba(255, 100, 100, 0.2);
	}

	.keystone {
		background-color: rgba(100, 255, 100, 0.2);
	}

	.keystone.unidentified {
		background-color: rgba(255, 0, 100, 0.2);
	}

	.small {
		background-color: rgba(255, 255, 255, 0.2);
	}

	.small.unidentified {
		background-color: rgba(255, 0, 100, 0.2);
	}

	.notable.selected {
		background-color: rgba(255, 255, 0, 0.6);
	}

	.keystone.selected {
		background-color: rgba(0, 255, 0, 0.6);
	}

	.small.selected {
		background-color: rgba(255, 255, 255, 0.6);
	}

	.keystone.highlighted {
		border: 2px solid green;
	}

	.notable.highlighted {
		border: 1px solid yellow;
	}

	.small.highlighted {
		border: 1px solid yellow;
	}

	.unidentified.highlighted {
		border: 1px solid red;
	}

	@keyframes glow {
		0% {
			box-shadow: 0 0 5px rgba(255, 0, 0, 0.5);
		}
		50% {
			box-shadow: 0 0 15px rgba(255, 0, 0, 1);
		}
		100% {
			box-shadow: 0 0 5px rgba(255, 0, 0, 0.5);
		}
	}

	.search-result {
		border: 3px solid rgba(255, 0, 0, 0.8);
		animation: glow 2s infinite;
	}
</style>
