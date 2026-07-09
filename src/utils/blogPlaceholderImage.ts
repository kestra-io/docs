import { readFile } from "node:fs/promises"
import path from "node:path"
import satori from "satori"
import sharp from "sharp"

// Generates a 1600x900 placeholder cover for blog posts published without a
// `image` in their frontmatter: Kestra logo, the post title (wrapped over
// multiple lines), category, date, and the author's avatar when one exists
// in ~/assets/teams (initials otherwise).
//
// Runs only during prerendering (Node), never on the Cloudflare Worker.

const WIDTH = 1600
const HEIGHT = 900

const ASSETS_DIR = path.resolve(process.cwd(), "src/assets")
const FONTS_DIR = path.join(ASSETS_DIR, "fonts/mona-sans")

export interface BlogPlaceholderAuthor {
    name: string
    image?: string
}

export interface BlogPlaceholderOptions {
    title: string
    category?: string
    date?: Date
    authors: BlogPlaceholderAuthor[]
}

let fontsPromise: Promise<{ name: string; weight: 400 | 600 | 700; style: "normal"; data: Buffer }[]> | null = null

function loadFonts() {
    fontsPromise ??= Promise.all(
        ([400, 600, 700] as const).map(async (weight) => ({
            name: "Mona Sans",
            weight,
            style: "normal" as const,
            data: await readFile(path.join(FONTS_DIR, `mona-sans-${weight}.ttf`)),
        })),
    )
    return fontsPromise
}

let logoPromise: Promise<string> | null = null

function loadLogo() {
    logoPromise ??= readFile(path.join(ASSETS_DIR, "logo-white.svg")).then(
        (data) => `data:image/svg+xml;base64,${data.toString("base64")}`,
    )
    return logoPromise
}

async function loadAvatar(slug?: string): Promise<string | null> {
    if (!slug) return null
    // "-round" and "-sm" are pre-cropped square headshots; the bare filename
    // is often a full-body or non-square portrait, so prefer the square
    // variants and only fall back to the bare name if neither exists.
    for (const suffix of ["-round", "-sm", ""]) {
        try {
            const data = await readFile(path.join(ASSETS_DIR, "teams", `${slug}${suffix}.png`))
            return `data:image/png;base64,${data.toString("base64")}`
        } catch {
            // try the next naming variant
        }
    }
    return null
}

function initials(name: string): string {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]!.toUpperCase())
        .join("")
}

// satori element helper, à la createElement
const h = (type: string, props: Record<string, unknown> = {}, ...children: unknown[]) => ({
    type,
    props: { ...props, children: children.length === 1 ? children[0] : children },
})

const AVATAR_SIZE = 88

function avatarNode(image: string | null, name: string) {
    if (image) {
        return h("img", {
            src: image,
            width: AVATAR_SIZE,
            height: AVATAR_SIZE,
            style: {
                objectFit: "cover",
                borderRadius: "50%",
                border: "3px solid rgba(255,255,255,0.35)",
            },
        })
    }
    return h(
        "div",
        {
            style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: `${AVATAR_SIZE}px`,
                height: `${AVATAR_SIZE}px`,
                borderRadius: "50%",
                border: "3px solid rgba(255,255,255,0.35)",
                backgroundColor: "rgba(99,27,255,0.45)",
                fontSize: "36px",
                fontWeight: 600,
                color: "#e0d4ff",
            },
        },
        initials(name),
    )
}

export async function generateBlogPlaceholder(options: BlogPlaceholderOptions): Promise<Buffer> {
    const { title, category, date, authors } = options
    const [fonts, logo] = await Promise.all([loadFonts(), loadLogo()])
    const avatars = await Promise.all(authors.map((author) => loadAvatar(author.image)))

    const authorNames = authors.map((author) => author.name).join(", ")
    const formattedDate = date
        ? new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(date)
        : null

    const tree = h(
        "div",
        {
            style: {
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "80px 90px",
                fontFamily: "Mona Sans",
                color: "#ffffff",
                backgroundColor: "#0e0d14",
                backgroundImage:
                    "radial-gradient(circle at 82% -15%, rgba(99,27,255,0.55) 0%, rgba(99,27,255,0.18) 38%, rgba(14,13,20,0) 65%), " +
                    "radial-gradient(circle at -10% 115%, rgba(99,27,255,0.35) 0%, rgba(14,13,20,0) 55%)",
            },
        },
        // header: logo + category pill
        h(
            "div",
            { style: { display: "flex", alignItems: "center", justifyContent: "space-between" } },
            h("img", { src: logo, width: 234, height: 54 }),
            category
                ? h(
                      "div",
                      {
                          style: {
                              display: "flex",
                              fontSize: "26px",
                              fontWeight: 600,
                              padding: "12px 28px",
                              borderRadius: "999px",
                              border: "1px solid rgba(255,255,255,0.25)",
                              backgroundColor: "rgba(99,27,255,0.25)",
                              color: "#e0d4ff",
                          },
                      },
                      category,
                  )
                : h("div", { style: { display: "flex" } }),
        ),
        // title, wraps over multiple lines when needed
        h(
            "div",
            {
                style: {
                    display: "flex",
                    fontSize: title.length > 70 ? "68px" : "80px",
                    fontWeight: 700,
                    lineHeight: 1.15,
                    letterSpacing: "-0.02em",
                    maxWidth: "1300px",
                },
            },
            title,
        ),
        // footer: author avatar(s) + name(s) + date
        h(
            "div",
            { style: { display: "flex", alignItems: "center", gap: "24px" } },
            ...authors.map((author, index) => avatarNode(avatars[index] ?? null, author.name)),
            h(
                "div",
                { style: { display: "flex", flexDirection: "column" } },
                authorNames
                    ? h("div", { style: { display: "flex", fontSize: "32px", fontWeight: 600 } }, authorNames)
                    : null,
                formattedDate
                    ? h(
                          "div",
                          {
                              style: {
                                  display: "flex",
                                  fontSize: "26px",
                                  fontWeight: 400,
                                  color: "rgba(255,255,255,0.6)",
                              },
                          },
                          formattedDate,
                      )
                    : null,
            ),
        ),
    )

    const svg = await satori(tree as Parameters<typeof satori>[0], { width: WIDTH, height: HEIGHT, fonts })
    return sharp(Buffer.from(svg)).webp({ quality: 85 }).toBuffer()
}
