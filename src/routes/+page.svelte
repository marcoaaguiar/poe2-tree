<script lang="ts">
	import { base } from '$app/paths';
	import { type NodePosition, type TooltipContent, loadData } from '$lib';
	import { onMount, tick } from 'svelte';
	import { browser } from '$app/environment';

	let { positions: nodes, nodesDescription: nodesDesc } = loadData();

	let containerEl: HTMLDivElement | null = null;
	let imageEl: HTMLImageElement | null = null;
	let imageWrapperEl: HTMLDivElement | null = null; // Reference to the image wrapper
	let tooltipEl: HTMLDivElement | null = null; // Reference to the tooltip element
	let hasLoaded = false;

	let tooltipContent: TooltipContent | null = null;
	let tooltipX = 0;
	let tooltipY = 0;

	// State for panning
	let isPanning = false;
	let panStartX = 0;
	let panStartY = 0;
	let panOffsetX = 0;
	let panOffsetY = 0;

	// State for zoom
	let scale = 0.75; // Initial zoom level (almost fully zoomed out)
	const minScale = 0.5; // Minimum zoom out level
	const maxScale = 3; // Maximum zoom in level

	// Base size for nodes
	const baseNodeSize = 20; // Adjust as needed

	// State for search
	let searchTerm = '';
	let searchResults: string[] = [];

	// State for selected nodes
	let selectedNodes: string[] = [];

	// Load saved selected nodes from localStorage on component initialization
	if (browser) {
		const savedSelectedNodes = localStorage.getItem('selectedSkillNodes');
		if (savedSelectedNodes) {
			try {
				selectedNodes = JSON.parse(savedSelectedNodes);
			} catch (error) {
				console.error('Error parsing saved selected nodes:', error);
			}
		}
	}

	// Reactive statement to save selected nodes to localStorage whenever they change
	$: if (browser) {
		localStorage.setItem('selectedSkillNodes', JSON.stringify(selectedNodes));
	}

	// State for filters
	let highlightKeystones = false;
	let highlightNotables = false;
	let highlightSmalls = false;
	let hideUnidentified = false;
	let hideUnselected = false;
	let hideSmall = false;

	// State for selected nodes display
	let showSelectedNodesDisplay = false;
	let isSelectedNodesDisplayPinned = false;

	let selectedNodesDisplayEl: HTMLDivElement | null = null;
	let selectedNodesSpanEl: HTMLSpanElement | null = null;

	// State for search results display
	let showSearchResultsDisplay = false;
	let isSearchResultsDisplayPinned = false;

	let searchResultsDisplayEl: HTMLDivElement | null = null;
	let searchResultsSpanEl: HTMLSpanElement | null = null;

	// Reactive statement for search
	$: handleSearch(searchTerm);

	async function activateTooltip(node: NodePosition) {
		tooltipContent = nodesDesc[node.id];

		if (!imageEl || !containerEl) return;

		// Calculate node position relative to the container, accounting for pan offsets
		const nodeX = node.x * imageEl.naturalWidth * scale + panOffsetX;
		const nodeY = node.y * imageEl.naturalHeight * scale + panOffsetY;

		// Initial tooltip position
		tooltipX = nodeX + 20; // Adjust as needed
		tooltipY = nodeY - 20;

		await tick(); // Wait for the tooltip to render

		if (tooltipEl && containerEl) {
			const tooltipRect = tooltipEl.getBoundingClientRect();
			const containerRect = containerEl.getBoundingClientRect();

			// Compute tooltip position relative to container
			const tooltipLeftInContainer = tooltipRect.left - containerRect.left;
			const tooltipRightInContainer = tooltipLeftInContainer + tooltipRect.width;
			const tooltipTopInContainer = tooltipRect.top - containerRect.top;
			const tooltipBottomInContainer = tooltipTopInContainer + tooltipRect.height;

			// Adjust positions to keep tooltip within container
			if (tooltipRightInContainer > containerRect.width) {
				tooltipX -= tooltipRightInContainer - containerRect.width + 20;
			}

			if (tooltipLeftInContainer < 0) {
				tooltipX += -tooltipLeftInContainer + 20;
			}

			if (tooltipBottomInContainer > containerRect.height) {
				tooltipY -= tooltipBottomInContainer - containerRect.height + 20;
			}

			if (tooltipTopInContainer < 0) {
				tooltipY += -tooltipTopInContainer + 20;
			}
		}
	}

	function handleContainerMousedown(event: MouseEvent) {
		event.preventDefault();

		if (event.button === 0) {
			if (containerEl) {
				containerEl.focus();
			}

			isPanning = true;
			panStartX = event.clientX - panOffsetX;
			panStartY = event.clientY - panOffsetY;
		}
	}

	function toggleNodeSelection(node: NodePosition) {
		if (selectedNodes.includes(node.id)) {
			// Deselect node
			selectedNodes = selectedNodes.filter((id) => id !== node.id);
		} else {
			// Select node
			selectedNodes = [...selectedNodes, node.id];
		}
	}

	function handleMouseMove(event: MouseEvent) {
		if (isPanning && containerEl) {
			panOffsetX = event.clientX - panStartX;
			panOffsetY = event.clientY - panStartY;
			clampPanOffsets();
		}
	}

	function handleMouseUp(event: MouseEvent) {
		if (event.button === 0) {
			isPanning = false;
		}
	}

	function handleMouseEnter(node: NodePosition) {
		if (!isPanning) {
			activateTooltip(node);
		}
	}

	function handleMouseLeave() {
		if (!isPanning) {
			tooltipContent = null;
		}
	}

	function handleWheel(event: WheelEvent) {
		event.preventDefault();

		const zoomIntensity = 0.1;
		const wheel = event.deltaY < 0 ? 1 : -1;
		const oldScale = scale;

		// Calculate new scale
		scale += wheel * zoomIntensity * scale;
		scale = Math.max(minScale, Math.min(maxScale, scale));

		// Adjust pan offsets to zoom relative to the mouse position
		if (containerEl && imageEl) {
			const rect = containerEl.getBoundingClientRect();
			const mouseX = event.clientX - rect.left;
			const mouseY = event.clientY - rect.top;

			const nodeX = (mouseX - panOffsetX) / oldScale;
			const nodeY = (mouseY - panOffsetY) / oldScale;

			panOffsetX = mouseX - nodeX * scale;
			panOffsetY = mouseY - nodeY * scale;

			clampPanOffsets();
		}
	}

	function handleImageLoad() {
		hasLoaded = true;

		if (imageEl && containerEl) {
			const imageWidth = imageEl.naturalWidth * scale;
			const imageHeight = imageEl.naturalHeight * scale;
			const containerWidth = containerEl.clientWidth;
			const containerHeight = containerEl.clientHeight;

			panOffsetX = (containerWidth - imageWidth) / 2;
			panOffsetY = (containerHeight - imageHeight) / 2;
		}
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

	function clampPanOffsets() {
		if (imageEl && containerEl) {
			const scaledWidth = imageEl.naturalWidth * scale;
			const scaledHeight = imageEl.naturalHeight * scale;
			const containerWidth = containerEl.clientWidth;
			const containerHeight = containerEl.clientHeight;

			const minPanX = containerWidth - scaledWidth;
			const minPanY = containerHeight - scaledHeight;

			if (containerWidth < scaledWidth) {
				panOffsetX = Math.max(minPanX, Math.min(0, panOffsetX));
			} else {
				panOffsetX = (containerWidth - scaledWidth) / 2;
			}

			if (containerHeight < scaledHeight) {
				panOffsetY = Math.max(minPanY, Math.min(0, panOffsetY));
			} else {
				panOffsetY = (containerHeight - scaledHeight) / 2;
			}
		}
	}

	function clearSelectedNodes() {
		selectedNodes = [];
		// Clear localStorage when all nodes are cleared
		if (browser) {
			localStorage.removeItem('selectedSkillNodes');
		}
	}

	// Add event listeners for global mouse events to handle panning
	onMount(() => {
		const handleMove = (event: MouseEvent) => {
			if (isPanning) {
				handleMouseMove(event);
			}
		};

		const handleUp = (event: MouseEvent) => {
			if (isPanning) {
				handleMouseUp(event);
			}
		};

		window.addEventListener('mousemove', handleMove);
		window.addEventListener('mouseup', handleUp);

		// Handle clicks outside the selected nodes and search results display
		const handleClickOutside = (event: MouseEvent) => {
			const clickedOutsideSelectedNodes =
				isSelectedNodesDisplayPinned &&
				!selectedNodesDisplayEl?.contains(event.target as Node) &&
				!selectedNodesSpanEl?.contains(event.target as Node);

			const clickedOutsideSearchResults =
				isSearchResultsDisplayPinned &&
				!searchResultsDisplayEl?.contains(event.target as Node) &&
				!searchResultsSpanEl?.contains(event.target as Node);

			if (clickedOutsideSelectedNodes) {
				isSelectedNodesDisplayPinned = false;
				showSelectedNodesDisplay = false;
			}

			if (clickedOutsideSearchResults) {
				isSearchResultsDisplayPinned = false;
				showSearchResultsDisplay = false;
			}
		};

		document.addEventListener('click', handleClickOutside);

		return () => {
			window.removeEventListener('mousemove', handleMove);
			window.removeEventListener('mouseup', handleUp);
			document.removeEventListener('click', handleClickOutside);
		};
	});

	function handleSelectedNodesMouseEnter() {
		showSelectedNodesDisplay = true;
	}

	function handleSelectedNodesMouseLeave() {
		if (!isSelectedNodesDisplayPinned) {
			showSelectedNodesDisplay = false;
		}
	}

	function handleSelectedNodesClick(event: MouseEvent) {
		isSelectedNodesDisplayPinned = !isSelectedNodesDisplayPinned;
		if (!isSelectedNodesDisplayPinned) {
			showSelectedNodesDisplay = false;
		} else {
			showSelectedNodesDisplay = true;
		}
		event.stopPropagation();
	}

	function handleSearchResultsMouseEnter() {
		showSearchResultsDisplay = true;
	}

	function handleSearchResultsMouseLeave() {
		if (!isSearchResultsDisplayPinned) {
			showSearchResultsDisplay = false;
		}
	}

	function handleSearchResultsClick(event: MouseEvent) {
		isSearchResultsDisplayPinned = !isSearchResultsDisplayPinned;
		if (!isSearchResultsDisplayPinned) {
			showSearchResultsDisplay = false;
		} else {
			showSearchResultsDisplay = true;
		}
		event.stopPropagation();
	}
</script>

<!-- Top Bar Section -->
<div class="top-bar">
	<!-- GitHub link to the top-right corner -->
	<div class="github-text">
		<p>本项目来自GitHub开源<br>汉化文本来源于chat-gpt4.0（施工者：超昂蓝莓）<br>如果愿意提供更好的汉化文本或建议可以随时联系我</p>
	</div>

	<div class="github-link">
		<a href="https://github.com/marcoaaguiar/poe2-tree" target="_blank" rel="noopener noreferrer">
			<!-- GitHub SVG Icon -->
			<svg height="32" viewBox="0 0 16 16" width="32" aria-hidden="true">
				<path
					fill-rule="evenodd"
					d="M8 0C3.58 0 0 3.58 0 8a8 8 0 005.47 7.59c.4.07.55-.17.55-.38
					  0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52
					  0-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95
					  0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.22 2.2.82a7.65 7.65 0 012 0c1.53-1.04
					  2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15
					  0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48
					  0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8 8 0 0016 8c0-4.42-3.58-8-8-8z"
				>
				</path>
			</svg>
		</a>
	</div>

	<div class="wechat-link">
		<svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 0 50 50" width="32" aria-hidden="true">
			<path d="M 19 6 C 9.625 6 2 12.503906 2 20.5 C 2 24.769531 4.058594 28.609375 7.816406 31.390625 L 5.179688 39.304688 L 13.425781 34.199219 C 15.714844 34.917969 18.507813 35.171875 21.203125 34.875 C 23.390625 39.109375 28.332031 42 34 42 C 35.722656 42 37.316406 41.675781 38.796875 41.234375 L 45.644531 45.066406 L 43.734375 38.515625 C 46.3125 36.375 48 33.394531 48 30 C 48 23.789063 42.597656 18.835938 35.75 18.105469 C 34.40625 11.152344 27.367188 6 19 6 Z M 13 14 C 14.101563 14 15 14.898438 15 16 C 15 17.101563 14.101563 18 13 18 C 11.898438 18 11 17.101563 11 16 C 11 14.898438 11.898438 14 13 14 Z M 25 14 C 26.101563 14 27 14.898438 27 16 C 27 17.101563 26.101563 18 25 18 C 23.898438 18 23 17.101563 23 16 C 23 14.898438 23.898438 14 25 14 Z M 34 20 C 40.746094 20 46 24.535156 46 30 C 46 32.957031 44.492188 35.550781 42.003906 37.394531 L 41.445313 37.8125 L 42.355469 40.933594 L 39.105469 39.109375 L 38.683594 39.25 C 37.285156 39.71875 35.6875 40 34 40 C 27.253906 40 22 35.464844 22 30 C 22 24.535156 27.253906 20 34 20 Z M 29.5 26 C 28.699219 26 28 26.699219 28 27.5 C 28 28.300781 28.699219 29 29.5 29 C 30.300781 29 31 28.300781 31 27.5 C 31 26.699219 30.300781 26 29.5 26 Z M 38.5 26 C 37.699219 26 37 26.699219 37 27.5 C 37 28.300781 37.699219 29 38.5 29 C 39.300781 29 40 28.300781 40 27.5 C 40 26.699219 39.300781 26 38.5 26 Z"></path>
		</svg>
		<img class="wechat-hover-image" src="wechat121.png" alt="WeChat QR Code">
	</div>



	<h1>流放之路2 技能树预览</h1>

	<!-- Filters -->
	<div class="filters">
		<p><b>高亮筛选:</b></p>
		<label><input type="checkbox" bind:checked={highlightKeystones} />基石天赋</label>
		<label><input type="checkbox" bind:checked={highlightNotables} />大天赋</label>
		<label><input type="checkbox" bind:checked={highlightSmalls} />小天赋</label>
	</div>
	<div class="filters">
		<p><b>勾选隐藏:</b></p>
		<label><input type="checkbox" bind:checked={hideUnidentified} />未收录</label>
		<label><input type="checkbox" bind:checked={hideUnselected} />未选中</label>
		<label><input type="checkbox" bind:checked={hideSmall} />小天赋</label>
	</div>
</div>

<!-- Search and Filter Section -->
<div class="search-bar">
	<input type="text" placeholder="搜索..." bind:value={searchTerm} />
	<span
		bind:this={searchResultsSpanEl}
		onmouseenter={handleSearchResultsMouseEnter}
		onmouseleave={handleSearchResultsMouseLeave}
		onclick={handleSearchResultsClick}
		style="cursor: pointer; margin-right: 10px;">搜索结果: {searchResults.length}</span
	>

	<!-- Search Results Display -->
	{#if showSearchResultsDisplay}
		<div class="info-display" bind:this={searchResultsDisplayEl}>
			{#if searchResults.length > 0}
				<ul>
					{#each searchResults as nodeId}
						<li>
							<strong>{nodesDesc[nodeId].name}</strong>
							<ul>
								{#each nodesDesc[nodeId].stats as stat}
									<li>{stat}</li>
								{/each}
							</ul>
						</li>
					{/each}
				</ul>
			{:else}
				<p>No search results.</p>
			{/if}
		</div>
	{/if}

	<span
		bind:this={selectedNodesSpanEl}
		onmouseenter={handleSelectedNodesMouseEnter}
		onmouseleave={handleSelectedNodesMouseLeave}
		onclick={handleSelectedNodesClick}
		style="cursor: pointer;">已选节点: {selectedNodes.length}/122</span
	>

	<!-- Selected Nodes Display -->
	{#if showSelectedNodesDisplay}
		<div class="info-display" bind:this={selectedNodesDisplayEl}>
			{#if selectedNodes.length > 0}
				<button onclick={clearSelectedNodes}>清除已选节点</button>
				<ul>
					<!-- Only display non small nodes -->
					{#each selectedNodes as nodeId}
						{#if !nodeId.startsWith('S')}
							<li>
								<strong>{nodesDesc[nodeId].name}</strong>
								<ul>
									{#each nodesDesc[nodeId].stats as stat}
										<li>{stat}</li>
									{/each}
								</ul>
							</li>
						{/if}
					{/each}
				</ul>
			{:else}
				<p>No nodes selected.</p>
			{/if}
		</div>
	{/if}
</div>

<!-- Skill Tree Container -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
	bind:this={containerEl}
	class="image-container"
	role="application"
	tabindex="-1"
	onmousedown={handleContainerMousedown}
	onwheel={handleWheel}
>
	<div
		bind:this={imageWrapperEl}
		class="image-wrapper"
		style="
			  width: {imageEl ? imageEl.naturalWidth * scale + 'px' : 'auto'};
			  height: {imageEl ? imageEl.naturalHeight * scale + 'px' : 'auto'};
			  transform: translate({panOffsetX}px, {panOffsetY}px);
			  user-select: none;
			  cursor: {isPanning ? 'grabbing' : 'grab'};
		  "
	>
		<img
			bind:this={imageEl}
			onload={handleImageLoad}
			src="{base}/skill-tree.png"
			alt="Interactive"
			draggable="false"
			style="
				  pointer-events: none;
				  max-width: none;
				  width: {imageEl ? imageEl.naturalWidth * scale + 'px' : 'auto'};
				  height: {imageEl ? imageEl.naturalHeight * scale + 'px' : 'auto'};
			  "
		/>

		<!-- Display hoverable regions with lighter color -->
		{#if hasLoaded}
			{#each ['notables', 'keystones', 'smalls'] as kind}
				{#each nodes[kind] as node}
					{#if !(hideSmall && node.id.startsWith('S'))}
						{#if !(hideUnselected && !selectedNodes.includes(node.id))}
							{#if !(hideUnidentified && nodesDesc[node.id].name === node.id)}
								<!-- svelte-ignore a11y_no_static_element_interactions -->
								<!-- svelte-ignore a11y_click_events_have_key_events -->
								<div
									class:notable={node.id.startsWith('N')}
									class:keystone={node.id.startsWith('K')}
									class:small={node.id.startsWith('S')}
									class:unidentified={nodesDesc[node.id].name === node.id}
									class:search-result={searchResults.includes(node.id)}
									class:selected={selectedNodes.includes(node.id)}
									class:highlighted-keystone={highlightKeystones && node.id.startsWith('K')}
									class:highlighted-notable={highlightNotables && node.id.startsWith('N')}
									class:highlighted-small={highlightSmalls && node.id.startsWith('S')}
									style="
								  width: {(baseNodeSize + node.id.startsWith('K') * 4 - node.id.startsWith('S') * 10) * scale}px;
								  height: {(baseNodeSize + node.id.startsWith('K') * 4 - node.id.startsWith('S') * 10) * scale}px;
								  left: {node.x * imageEl.naturalWidth * scale -
										((baseNodeSize + node.id.startsWith('K') * 4 - node.id.startsWith('S') * 10) *
											scale) /
											2}px;
								  top: {node.y * imageEl.naturalHeight * scale -
										((baseNodeSize + node.id.startsWith('K') * 4 - node.id.startsWith('S') * 10) *
											scale) /
											2}px;
							  "
									onmousedown={(event) => event.stopPropagation()}
									onclick={() => toggleNodeSelection(node)}
									onmouseenter={() => handleMouseEnter(node)}
									onmouseleave={handleMouseLeave}
								></div>
							{/if}
						{/if}
					{/if}
				{/each}
			{/each}
		{/if}
	</div>

	<!-- Tooltip displayed when a region is hovered -->
	{#if tooltipContent != null}
		<div bind:this={tooltipEl} class="tooltip" style="left: {tooltipX}px; top: {tooltipY}px;">
			<div class="title" style={`background-image: url('${base}/tooltip-header.png');`}>
				{tooltipContent.name}
			</div>
			<div class="body">
				{#each tooltipContent.stats as stat}
					<p class="stat-line">{stat}</p>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.top-bar {
		position: relative;
		padding: 10px;
		background-color: #000;
		color: #fff;
			font-family: "微软雅黑", "Arial", sans-serif;
	}

	.top-bar h1 {
		margin: 10px 0;
		font-size: 24px;
		text-align: center;
	}

	.top-bar p {
		margin: 5px 0;
		font-size: 16px;
		text-align: center;
	}

	.github-text {
		position: absolute;
		top: 10px;
		right: 10px;
		text-wrap: balance;
		font-family: "微软雅黑", "Arial", sans-serif;
		text-align: right;
	}

	.github-link {
		position: absolute;
		top: 85px;
		right: 20px;
	}

  .wechat-link {
      position: absolute;
      top: 85px;
      right: 70px;
  }
  .wechat-link svg {
      fill: #fff;
      transition: fill 0.3s;
  }

  .wechat-link:hover svg {
      fill: #FF4500; /* 这是橙色 */
  }

  .wechat-hover-image {
      display: none;
      position: absolute;
      top: 0;
      right: 0;
      width: 358px;  /* 调整为图片的宽度 */
      height: 485px; /* 调整为图片的高度 */
      z-index: 1000;
  }

  .wechat-link:hover .wechat-hover-image {
      display: block;
  }


  .github-link a {
		color: #fff;
		text-decoration: none;
	}

	.github-link svg {
		fill: #fff;
		transition: fill 0.3s;
	}

	.github-link svg:hover {
		fill: #4078c0;
	}

	.search-bar {
		text-align: center;
		margin-bottom: 10px;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 10px;
	}

	.search-bar input {
		padding: 5px;
		font-size: 16px;
	}

	.search-bar span {
		font-size: 16px;
		cursor: pointer;
		position: relative;
	}

	.filters {
		display: inline-block;
		margin-top: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.filters label {
		margin-right: 10px;
		font-size: 14px;
	}

	.image-container {
		position: relative;
		display: block;
		overflow: hidden;
		outline: none;
		width: 100vw;
		height: calc(100vh - 200px); /* Adjust based on top bar height */
	}

	.image-wrapper {
		position: absolute;
		top: 0;
		left: 0;
	}

	.small,
	.notable,
	.keystone {
		position: absolute;
		border-radius: 50%;
		pointer-events: auto;
	}

	.notable {
		background-color: rgba(255, 255, 0, 0.2);
	}

	.notable.unidentified {
		background-color: rgba(255, 100, 100, 0.2);
		border-color: rgba(255, 100, 100, 1);
	}

	.keystone {
		background-color: rgba(100, 255, 100, 0.2);
	}

	.keystone.unidentified {
		background-color: rgba(255, 0, 100, 0.2);
		border-color: rgba(255, 0, 100, 1);
	}

	.small {
		background-color: rgba(255, 255, 255, 0.2);
	}

	.small.unidentified {
		background-color: rgba(255, 255, 255, 0.2);
		border-color: rgba(255, 100, 100, 1);
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

	.highlighted-keystone {
		border: 2px solid green;
	}

	.highlighted-notable {
		border: 1px solid yellow;
	}
	.highlighted-small {
		border: 1px solid yellow;
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

	.tooltip {
		position: absolute;
		min-width: 300px;
		max-width: 400px;
		border-radius: 8px;
		background-color: black; /* Slightly lighter background for the box */
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.8); /* Subtle shadow */
		opacity: 0.9;
		z-index: 1000; /* Ensure tooltip appears above other elements */
		pointer-events: none; /* Allow clicks to pass through the tooltip */

		/* Title style */
		.title {
			font-size: 1.5rem;
			color: #f0e7e5; /* Light gold for the title text */
			text-align: center;
			margin-bottom: 15px;
			background-size: cover; /* Ensure the image covers the entire title area */
			background-position: center; /* Center the background image */
			border-radius: 8px; /* Rounded corners */
			padding: 10px 0; /* Space inside the title */
			text-shadow: 0 0 5px rgba(255, 255, 255, 0.2); /* Subtle glow effect */
			display: inline-block; /* Shrinks to fit the content */
			width: 100%; /* Adjust to content size */
		}

		/* Body text style */
		.body {
			font-family: 'Fontin SmallCaps', sans-serif;
			font-size: 16px;
			line-height: 1.5; /* Improve readability */
			color: #7d7aad; /* Light blue for body text */
			margin-bottom: 15px; /* Spacing below body */
			padding: 10px 20px;

			.stat-line {
				margin: 0 auto;
			}
		}
	}

	.info-display {
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		background-color: rgba(0, 0, 0, 0.9);
		border: 1px solid #444;
		z-index: 100;
		padding: 10px;
		max-height: 300px;
		overflow-y: auto;
		width: 300px;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
		color: #fff;
		border-radius: 8px;
	}

	.info-display ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.info-display li {
		margin-bottom: 10px;
	}

	.info-display strong {
		font-size: 16px;
		color: #f0e7e5;
	}

	.info-display ul ul {
		margin-top: 5px;
		margin-left: 15px;
	}

	.info-display ul ul li {
		font-size: 14px;
		color: #7d7aad;
	}

	.info-display p {
		color: #7d7aad;
		font-size: 14px;
	}

	/* Style for the clear button */
	.info-display button {
		background-color: rgba(0, 0, 0, 0.9);
		color: white;
		border: 1px solid #444;
		padding: 5px 10px;
		margin-bottom: 10px;
		cursor: pointer;
		border-radius: 4px;
		font-family: 'Fontin SmallCaps', sans-serif;
	}

	.info-display button:hover {
		background-color: #c9302c;
	}
</style>
