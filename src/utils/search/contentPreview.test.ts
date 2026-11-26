import { describe, expect, it } from "vitest"
import { pageLink, youtubeVideoId } from "~/utils/search/contentPreview"

const origin = "https://kestra.io"

describe("pageLink", () => {
    it("resolves a relative link from the page's own URL", () => {
        expect(
            pageLink(
                "./kestra-cli/kestractl#installation",
                "docs/quickstart",
                origin,
            ),
        ).toBe("/docs/kestra-cli/kestractl#installation")
        expect(pageLink("../secret", "docs/concepts/kv-store", origin)).toBe(
            "/docs/secret",
        )
        expect(
            pageLink("./image.png", "blogs/airflow-3-vs-airflow-2", origin),
        ).toBe("/blogs/image.png")
    })

    it("points a heading anchor at the page, not at the page the popup is open on", () => {
        expect(pageLink("#step-1", "docs/quickstart", origin)).toBe(
            "/docs/quickstart#step-1",
        )
    })

    it("keeps external links whole", () => {
        expect(
            pageLink(
                "https://github.com/kestra-io/kestra",
                "docs/quickstart",
                origin,
            ),
        ).toBe("https://github.com/kestra-io/kestra")
    })
})

describe("youtubeVideoId", () => {
    it("reads the video of a YouTube embed", () => {
        expect(
            youtubeVideoId("https://www.youtube.com/embed/a2BZ7vOihjg?si=x"),
        ).toBe("a2BZ7vOihjg")
        expect(
            youtubeVideoId("https://www.youtube-nocookie.com/embed/abc-123"),
        ).toBe("abc-123")
    })

    it("has no video for a playlist or another embed", () => {
        expect(
            youtubeVideoId(
                "https://www.youtube.com/embed/videoseries?list=PL123",
            ),
        ).toBeUndefined()
        expect(
            youtubeVideoId("https://app.arcade.software/embed/abc"),
        ).toBeUndefined()
    })
})
