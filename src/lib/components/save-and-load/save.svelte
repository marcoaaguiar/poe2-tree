<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import type { SaveData } from './types';
	import { showModal } from './store.svelte';

	let savedData = writable<SaveData[]>([]);

	let title = $state<string>('');
	let description = $state<string>('');
	let ascendancy = $state<string>('');
	let passivesCompressed = $state<string>('');
	let selectedIndex = $state<number>(-1);

	onMount(() => {
		const data = JSON.parse(localStorage.getItem('savedData') || '[]');
		savedData.set(data);

		const params = new URLSearchParams(window.location.search);
		ascendancy = params.get('a') || '';
		passivesCompressed = params.get('p') || '';
	});

	const saveData = (e: Event) => {
		e.preventDefault();

		const data = { title, description, ascendancy, passivesCompressed };
		savedData.update((items) => {
			if (selectedIndex >= 0) {
				items[selectedIndex] = data;
			} else {
				items.push(data);
			}
			localStorage.setItem('savedData', JSON.stringify(items));
			return items;
		});

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
