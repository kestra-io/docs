// @FIXME: remove ? Astro supports it natively
import type { APIRoute } from "astro"

export const GET: APIRoute = ({ redirect, originPathname }) => {
    // trim the final slash if it exists
    const trimmedPathname = originPathname.endsWith("/")
        ? originPathname.slice(0, -1)
        : originPathname

    return redirect(`${trimmedPathname}/all`, 301)
}