<script lang="ts">
	import { showModal, modalAction } from './store.svelte';
</script>

<button
	onclick={() => {
		modalAction.set('load');
		showModal.set(true);
	}}
	>Load
</button>
