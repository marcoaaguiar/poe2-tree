<script lang="ts">
	import { showModal, modalAction } from './store.svelte';
</script>

<button
	class="hover:bg-slate-700 px-4 py-1 border rounded hover:border-white border-solid border-transparent"
	onclick={() => {
		modalAction.set('load');
		showModal.set(true);
	}}
	>Load
</button>
