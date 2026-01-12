interface BlueprintTag {
    id?: string;
    name: string;
}

interface Blueprint {
    id: number;
    title: string;
    includedTasks: string[];
    tags?: string[];
    namespace: string
    name: string
    description: string
    tasks: Array<{id: string, type: string}>
    tags: Array<string>
    createdAt: string
    updatedAt: string
}