<script lang="ts">
	import { showModal, modalAction } from './store.svelte';
</script>

<button
	onclick={() => {
		modalAction.set('save');
		showModal.set(true);
	}}
>
	Save
</button>
