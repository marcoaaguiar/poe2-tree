<script lang="ts">
	import { init, locale, addMessages, getLocaleFromNavigator } from 'svelte-i18n';

	// Register translation files
	import en from '../lib/data/nodes_desc.json';
	import sv from '../locales/sv.json';

	addMessages('en', en);
	addMessages('sv', sv);
	let lang = getLocaleFromNavigator() || 'en';
	// Initialize i18n
	init({
		fallbackLocale: 'en',
		initialLocale: getLocaleFromNavigator()
	});

	// // Helper to switch locales
	function changeLocale(): void {
		console.log('aafsdfd', lang)
		locale.set(lang);
		localStorage.setItem('locale', lang); // Persist selection
	}

	let { children } = $props();
</script>

<nav>
	<select bind:value={lang} onchange={changeLocale}>
		{#each ['en', 'sv'] as lang}
			<option style="" value={lang}>
				{lang}
			</option>
		{/each}
	</select>
</nav>
{@render children()}

<style>
	:global(body) {
		margin: 0;
		background-color: black;
		color: #e4dfd7;
		font-family: 'Fontin SmallCaps', sans-serif;
	}
</style>
