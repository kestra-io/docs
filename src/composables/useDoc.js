import { useState } from "#imports"

export const useDoc = () => {
    const page = useState("ks-page", () => ({}))

    return {
        page,
    }
}