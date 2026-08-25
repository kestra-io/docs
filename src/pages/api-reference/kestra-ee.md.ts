import type { APIRoute } from "astro"
import { generateApiMarkdown } from "~/utils/openapi-to-markdown"

// Must stay a build-time static artifact: conversion takes seconds and the
// Worker bundle doesn't ship the Scalar converter.
export const prerender = true

export const GET: APIRoute = async () => {
    const markdown = await generateApiMarkdown("kestra-ee.yml")

    return new Response(markdown, {
        status: 200,
        headers: {
            "Content-Type": "text/markdown; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
        },
    })
}
