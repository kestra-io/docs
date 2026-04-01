/**
 * Shared reactive state for the site-wide search and AI chat modals.
 *
 * The refs are module-level singletons so every component that imports this
 * composable shares the same reactive state — no Pinia / event-bus required.
 *
 * Usage:
 *   import { showSearch, showAiChat } from "~/composables/useSearchModal"
 *   showSearch.value = true   // opens the search modal from anywhere
 */
import { ref } from "vue"

export const showSearch = ref(false)
export const showAiChat = ref(false)
