import { writable } from 'svelte/store';

export const showModal = writable<boolean>(false);
export const modalAction = writable<null | 'save' | 'load'>(null);
