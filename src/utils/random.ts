import { NO_RANDOM_ORDER } from "astro:env/client"

export const randomSortFunction = () =>
    NO_RANDOM_ORDER ? 0 : 0.5 - Math.random()
