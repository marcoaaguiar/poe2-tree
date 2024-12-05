<script lang="ts">
	import { onMount } from 'svelte';
	import type { SaveData } from './types';
	import { showModal } from './store.svelte';

	let savedData = $state<SaveData[]>([]);
	let title = $state<string>('');
	let description = $state<string>('');
	let ascendancy = $state<string>('');
	let passivesCompressed = $state<string>('');
	let selectedIndex = $state<number>(-1);

	onMount(() => {
		const data = JSON.parse(localStorage.getItem('savedData') || '[]');
		savedData = data;

		const params = new URLSearchParams(window.location.search);
		ascendancy = params.get('a') || '';
		passivesCompressed = params.get('p') || '';
	});

	const saveData = (e: Event) => {
		e.preventDefault();

		const data = { title, description, ascendancy, passivesCompressed };
		if (selectedIndex >= 0) {
			savedData[selectedIndex] = data;
		} else {
			savedData = [...savedData, data];
		}
		localStorage.setItem('savedData', JSON.stringify(savedData));

		resetForm();

		showModal.set(false);
	};

	const resetForm = () => {
		title = '';
		description = '';
		selectedIndex = -1;
	};
</script>

<div class="p-4 bg-[#1a1a1a] text-white rounded-md">
	<h2 class="font-bold my-4 text-2xl">Save Build</h2>
	<form onsubmit={saveData} class="space-y-6">
		<div>
			<label for="saveslot" class="text-sm leading-none block">Select Build</label>
			<select
				class="text-black mt-4 px-3 rounded-md h-10"
				id="saveslot"
				bind:value={selectedIndex}
				onchange={() => {
					if (selectedIndex >= 0) {
						const selectedBuild = savedData[selectedIndex];
						title = selectedBuild.title;
						description = selectedBuild.description;
					}
				}}
			>
				<option value={-1}>New</option>
				{#each savedData as entry, index}
					<option value={index}>{entry.title}</option>
				{/each}
			</select>
		</div>

		<div>
			<label for="title" class="text-sm leading-none">Title</label>
			<input
				type="text"
				id="title"
				bind:value={title}
				class="px-3 py-2 text-sm h-10 w-full rounded-md text-black mt-2"
				placeholder="Title"
				required
			/>
		</div>

		<div>
			<label for="description">Description:</label>
			<textarea
				id="description"
				bind:value={description}
				class="px-3 py-2 text-sm w-full rounded-md text-black"
				placeholder="Description"
				rows="3"
			></textarea>
		</div>

		<button type="submit" class="border border-white rounded md px-4 py-1">Save</button>
	</form>
</div>
