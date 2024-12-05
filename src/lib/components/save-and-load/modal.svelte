<script lang="ts">
	import Load from './load.svelte';
	import Save from './save.svelte';
	import { showModal, modalAction } from './store.svelte';
	import { onDestroy } from 'svelte';

	let dialog: HTMLDialogElement | undefined = $state();

	// Subscribe to showModal store
	const unsubscribe = showModal.subscribe((value) => {
		if (value && dialog) {
			dialog.showModal();
		} else if (dialog) {
			dialog.close();
		}
	});

	onDestroy(() => {
		unsubscribe();
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog
	bind:this={dialog}
	onclose={() => showModal.set(false)}
	onclick={(e) => {
		if (e.target === dialog) {
			dialog.close();
		}
	}}
	class="rounded-md shadow-lg w-2/3 lg:w-1/3"
>
	{#if $modalAction === 'save'}
		<Save />
	{:else if $modalAction === 'load'}
		<Load />
	{/if}
</dialog>
