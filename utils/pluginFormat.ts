/**
 * Format element type string by adding spaces between camelCase words and capitalizing each word. e.g. "storageVolumes" -> "Storage Volumes"
 */
export const formatElementType = (type: string): string => {
    return type
        .replaceAll(/[A-Z]/g, match => ` ${match}`)
        .trim()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

/**
 * Extract the class name. Example: "io.kestra.core.tasks.flows.Flow" -> "Flow"
 */
export const formatElementName = (cls: string): string => {
    return cls.substring(cls.lastIndexOf(".") + 1);
};

/**
 * Transform title by adding zero-width space before uppercase letters and removing emojis.
 */
export const transformTitle = (text: string): string => {
    return text
        .replace(/([A-Z])/g, "&#x200B;$1")
        .replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, "");
};

/**
 * Format plugin name for display by extracting the last segment, stripping prefixes, and capitalizing words.
 */
export const formatPluginName = (raw?: string): string => {
    if (!raw) return "";
    const part = raw.split(".").pop() ?? raw;
    const words = part.replace(/^plugins?[-_]/i, "").split(/[-_]/).filter(Boolean);
    if (words.length === 0) return "";
    if (words.length === 1) {
        const w = words[0]!;
        return (/^[a-z0-9]{1,3}$/i.test(w) || /\d/.test(w)) 
            ? w.toUpperCase() 
            : w.charAt(0).toUpperCase() + w.slice(1);
    }
    return words.map(w => w!.charAt(0).toUpperCase() + w!.slice(1)).join(" ");
};

import { computed, ref, watch, type Ref, type ComputedRef } from "vue";

/**
 * Simple pagination composable used across plugin components.
 */
export function useSimplePagination<T = any>(
    items: Ref<T[]> | ComputedRef<T[]>,
    pageSize: Ref<number> | ComputedRef<number>
) {
    const currentPage = ref(1);

    const total = computed(() => (items as any).value?.length ?? 0);

    const isFirstPage = computed(() => currentPage.value <= 1);

    const isLastPage = computed(() => {
        const pages = Math.max(1, Math.ceil(total.value / (pageSize as any).value || 1));
        return currentPage.value >= pages;
    });

    function prev() { if (!isFirstPage.value) currentPage.value -= 1; }
    function next() { if (!isLastPage.value) currentPage.value += 1; }

    const visibleItems = computed(() => {
        const size = (pageSize as any).value ?? 1;
        const start = (currentPage.value - 1) * size;
        return (items as any).value?.slice(start, start + size) ?? [];
    });

    watch([() => (items as any).value?.length, () => (pageSize as any).value], () => currentPage.value = 1);

    return { currentPage, total, isFirstPage, isLastPage, prev, next, visibleItems } as const;
}
