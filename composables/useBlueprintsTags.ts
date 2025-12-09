export function useBlueprintsTags() {
    const tags = useState("blueprint-tags", () => [] as { id: string; name: string }[]);

    const { data } = useAsyncData(
        "blueprint-tags",
        () => $fetch(`${useRuntimeConfig().public.apiUrl}/blueprints/versions/latest/tags`),
        { server: false, dedupe: "defer" }
    );

    watchEffect(() => {
        if (data.value) tags.value = data.value;
    });

    const getName = (id: string) => tags.value.find((t) => t.id === id)?.name ?? id;

    return { tags, getName };
}
