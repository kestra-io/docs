export function useBlueprintsTags() {
    interface BlueprintTag {
        id: string;
        name: string;
    }

    const tags = useState<BlueprintTag[]>("blueprint-tags", () => []);

    const { data } = useAsyncData<BlueprintTag[]>(
        "blueprint-tags",
        () => $fetch(`${useRuntimeConfig().public.apiUrl}/blueprints/versions/latest/tags`),
        { server: false }
    );

    watchEffect(() => {
        if (data.value) tags.value = data.value;
    });

    const getName = (id: string) => tags.value.find((t) => t.id === id)?.name ?? id;

    return { tags, getName };
}
