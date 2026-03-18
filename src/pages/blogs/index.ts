// @FIXME: remove ? Astro supports it natively
import type { APIRoute } from "astro"
import { ALL_NEWS } from "~/components/blogs/categories"

export const GET: APIRoute = ({ redirect, originPathname }) => {
    // trim the final slash if it exists
    const trimmedPathname = originPathname.endsWith("/")
        ? originPathname.slice(0, -1)
        : originPathname

    return redirect(`${trimmedPathname}/${ALL_NEWS}`, 301)
}
