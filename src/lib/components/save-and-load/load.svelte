<script lang="ts">
	import { onMount } from 'svelte';
	import type { SaveData } from './types';
	import { goto } from '$app/navigation';
	import { showModal } from './store.svelte';

	let savedData = $state<SaveData[]>([]);

	onMount(() => {
		const data = JSON.parse(localStorage.getItem('savedData') || '[]');
		savedData = data;
	});

	function deleteEntry(selectedIndex: number) {
		if (confirm('Are you sure you want to delete this entry?')) {
			savedData = savedData.filter((_, index) => index !== selectedIndex);
			localStorage.setItem('savedData', JSON.stringify(savedData));
		}
	}

	function handleClick(selectedIndex: number) {
		console.log('Selected index:', selectedIndex);

		const selectedBuild = savedData[selectedIndex];

		if (selectedBuild) {
			showModal.set(false);

			const params = new URLSearchParams();
			params.set('a', selectedBuild.ascendancy);
			params.set('p', selectedBuild.passivesCompressed);

			if (!selectedBuild?.ascendancy || !selectedBuild.passivesCompressed || !selectedBuild.title) {
				console.error('Invalid build data');
				return;
			}

			// TODO: switch to sveltekit's goto when +page.svelte is switched to runes.
			// To many issues without runes and $effect.
			window.location.href = `/?${params.toString()}`;
		}
	}
</script>

<div class="rounded-md bg-[#1a1a1a] text-white w-full p-8 space-y-2">
	<h2 class="font-bold my-4 text-2xl">Load Build</h2>
	<table class="table-auto border-collapse text-sm w-full">
		<thead>
			<tr class="bg-slate-700">
				<th class="border-b border-slate-700 px-4 pt-8 pl-8 pb-3 text-left font-bold">Title</th>
				<th class="border-b border-slate-700 px-4 pt-8 pb-3 text-left font-bold">Description</th>
				<th class="border-b border-slate-700 px-4 pt-8 pr-8 pb-3 text-left font-bold"> </th>
			</tr>
		</thead>
		<tbody class="bg-[#1a1a1a]">
			{#each savedData as entry, index}
				<tr>
					<td class="border-b border-slate-700 p-4 pl-8">{entry.title}</td>
					<td class="border-b border-slate-700 p-4">{entry.description}</td>
					<td class="border-b border-slate-700 p-4 pr-8 flex items-center justify-center gap-6">
						<button
							onclick={() => handleClick(index)}
							class="flex justify-center items-center gap-2 hover:text-green-500"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-5"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
								/>
							</svg>
							<span>Load</span>
						</button>
						<button
							onclick={() => {
								deleteEntry(index);
							}}
							class="flex justify-center items-center gap-2 hover:text-red-500"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-5"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
								/>
							</svg>

							<span>Delete</span>
						</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
