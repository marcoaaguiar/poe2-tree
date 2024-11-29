<script lang="ts">
	import { base } from '$app/paths';
	import { type NodePosition, type TooltipContent, loadData } from '$lib';

	let { positions: nodes, nodesDescription: nodesDesc } = loadData();

	let imageEl: HTMLImageElement | null = $state(null);
	let hasLoaded = $state(false);

	let tooltipContent: TooltipContent | null = $state(null);
	let tooltipHold = $state(false);
	let tooltipX = $state(0);
	let tooltipY = $state(0);

	let searchTerm = $state('');
	let searchResults: string[] = $state([]);
	$effect(() => {
		handleSearch(searchTerm);
	});

	function activateTooltip(node: NodePosition) {
		tooltipContent = nodesDesc[node.id];

		if (!imageEl) return;

		tooltipX = node.x * imageEl.width + 20; // Offset for positioning
		tooltipY = node.y * imageEl.height - 20;
	}
	function handleMousedown(node: NodePosition) {
		tooltipHold = true;
		activateTooltip(node);
	}

	function handleMouseEnter(node: NodePosition) {
		activateTooltip(node);
		tooltipHold = false;
	}

	function handleMouseLeave() {
		if (!tooltipHold) {
			tooltipContent = null;
		}
	}

	function handleImageLoad() {
		// this is necessary to prevent the nodes being rendered at (0, 0) before the image has loaded
		hasLoaded = true;
	}

	function handleSearch(text: string) {
		if (!text) {
			searchResults = [];
			return;
		}

		const search = text.toLowerCase();

		searchResults = Object.entries(nodesDesc)
			.filter(
				([_, values]) =>
					values.name.toLowerCase().includes(search) ||
					values.stats.some((value) => value.toLowerCase().includes(search))
			)
			.map(([key, _]) => key);
	}
</script>

<div style="padding-left: 16px;">
	<h1>Path of Exile 2 Skill tree Preview</h1>

	<p>Incomplete skill tree preview. Hover over the nodes to see their details.</p>
	<p>Check out the Github repository for how to contribute to this project.</p>
</div>

<div>
	<label for="search">Search</label>
	<input type="text" placeholder="Search..." bind:value={searchTerm} />

	<span> > Search results: {searchResults.length}</span>
</div>

<div class="image-container">
	<img bind:this={imageEl} onload={handleImageLoad} src="{base}/skill-tree.png" alt="Interactive" />

	<!-- Display hoverable regions with lighter color -->
	{#if hasLoaded}
		<!-- content here -->
		{#each ['notables', 'keystones'] as kind}
			{#each nodes[kind] as node}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class:notable={node.id.startsWith('N')}
					class:keystone={node.id.startsWith('K')}
					class:unidentified={nodesDesc[node.id].name === node.id}
					class:search-result={searchResults.includes(node.id)}
					style="
        left: {node.x * imageEl?.width - 10}px;
        top: {node.y * imageEl?.height - 10}px;
      "
					onmousedown={() => handleMousedown(node)}
					onmouseenter={() => handleMouseEnter(node)}
					onmouseleave={handleMouseLeave}
				></div>
			{/each}
		{/each}
	{/if}

	<!-- Tooltip displayed when a region is hovered -->
	{#if tooltipContent != null}
		<div class="tooltip" style="left: {tooltipX}px; top: {tooltipY}px;">
			<div class="title">{tooltipContent.name}</div>
			{#each tooltipContent.stats as stat}
				<div class="body">{stat}</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.image-container {
		position: relative;
		display: inline-block;
	}

	.notable {
		position: absolute;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background-color: rgba(255, 255, 0, 0.2);
		pointer-events: auto; /* Allow mouse events */
	}
	.notable.unidentified {
		background-color: rgba(255, 100, 100, 0.2);
	}

	.keystone {
		position: absolute;
		width: 25px;
		height: 25px;
		border-radius: 50%;
		background-color: rgba(100, 255, 100, 0.2);
		pointer-events: auto; /* Allow mouse events */
	}
	.keystone.unidentified {
		background-color: rgba(255, 0, 100, 0.2);
	}

	.search-result {
		border: 2px solid rgba(255, 0, 0, 0.8);
	}

	.tooltip {
		position: absolute;
		background-color: black; /* Dark background */
		color: white; /* White text */
		font-family: 'Georgia', serif; /* Classic serif font */
		border: 2px solid #ffffff; /* White border */
		padding: 20px;
		max-width: 400px; /* Limit width */
		margin: 0 auto; /* Center align */
		border-radius: 5px; /* Slight rounded corners */

		/* Title style */
		.title {
			font-family: 'Fontin SmallCaps', sans-serif;
			font-size: 24px;
			font-weight: bold;
			text-align: center;
			color: #e4dfd7; /* Golden-like color for title */
			margin-bottom: 15px; /* Spacing below title */
		}

		/* Body text style */
		.body {
			font-family: 'Fontin SmallCaps', sans-serif;
			font-size: 16px;
			line-height: 1.5; /* Improve readability */
			color: #7d7aad; /* Light blue for body text */
			margin-bottom: 15px; /* Spacing below body */
		}
	}
</style>
