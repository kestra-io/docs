#!/usr/bin/env node
/**
 * Collapse a repeating grid of <rect> cells into one tiled <pattern>.
 *
 * Figma exports these grids a cell at a time, 160 to 530 rects per file. Every
 * one of them also carries a handful of hand-placed highlight cells in a
 * different colour, and most sit in a mask over a blurred glow, so the grid is
 * not a plain background a CSS gradient could replace. The repeating part
 * becomes a pattern tile; the highlights and the glow are left untouched.
 */
import { readFileSync, writeFileSync } from "node:fs"

const RECT = /<rect\b[^>]*\/?>/g
const attr = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1]
const num = (tag, name) => {
    const v = attr(tag, name)
    return v === undefined ? undefined : Number(v)
}

/** Spacing of an evenly spaced but sparsely populated axis. */
function pitchOf(values) {
    const v = [...new Set(values)].sort((a, b) => a - b)
    const gaps = v.slice(1).map((x, i) => x - v[i]).filter((g) => g > 0.01)
    if (!gaps.length) return null
    gaps.sort((a, b) => a - b)
    return gaps[Math.floor(gaps.length / 2)]
}

export function convert(src, id) {
    const rects = src.match(RECT) ?? []
    if (rects.length < 40) return null

    // the repeating field is whichever fill/stroke pairing dominates
    const tally = new Map()
    for (const r of rects) {
        if (!attr(r, "stroke")) continue
        const key = `${attr(r, "fill") ?? ""}|${attr(r, "stroke")}|${attr(r, "stroke-width") ?? ""}`
        tally.set(key, (tally.get(key) ?? 0) + 1)
    }
    if (!tally.size) return null
    const [key, count] = [...tally].sort((a, b) => b[1] - a[1])[0]
    if (count < 40) return null

    const field = rects.filter(
        (r) =>
            attr(r, "stroke") &&
            `${attr(r, "fill") ?? ""}|${attr(r, "stroke")}|${attr(r, "stroke-width") ?? ""}` === key,
    )
    const [fill, stroke, strokeWidth] = key.split("|")
    const xs = field.map((r) => num(r, "x") ?? 0)
    const ys = field.map((r) => num(r, "y") ?? 0)
    const px = pitchOf(xs)
    const py = pitchOf(ys)
    if (!px || !py) return null

    const w = num(field[0], "width")
    const sw = Number(strokeWidth || attr(src, "stroke-width") || 1)
    const x0 = Math.min(...xs)
    const y0 = Math.min(...ys)
    // one extra tile so the far right and bottom edges keep their line
    const bw = Math.max(...xs) - x0 + w + sw
    const bh = Math.max(...ys) - y0 + (num(field[0], "height") ?? w) + sw

    const r3 = (n) => Number(n.toFixed(3))
    const tile =
        `<pattern id="grid_${id}" width="${r3(px)}" height="${r3(py)}" ` +
        `patternUnits="userSpaceOnUse" x="${r3(x0 - sw / 2)}" y="${r3(y0 - sw / 2)}">` +
        (fill ? `<rect width="${r3(px)}" height="${r3(py)}" fill="${fill}"/>` : "") +
        `<rect width="${r3(px)}" height="${r3(sw)}" fill="${stroke}"/>` +
        `<rect width="${r3(sw)}" height="${r3(py)}" fill="${stroke}"/>` +
        `</pattern>`
    const plane =
        `<rect x="${r3(x0 - sw / 2)}" y="${r3(y0 - sw / 2)}" ` +
        `width="${r3(bw)}" height="${r3(bh)}" fill="url(#grid_${id})"/>`

    // drop the field, put the plane where the first one was so the
    // highlight cells still paint on top of it
    let placed = false
    let out = src.replace(RECT, (r) => {
        if (!field.includes(r)) return r
        if (placed) return ""
        placed = true
        return plane
    })
    out = out.includes("<defs>")
        ? out.replace("<defs>", `<defs>${tile}`)
        : out.replace("</svg>", `<defs>${tile}</defs></svg>`)
    return out
}

const files = process.argv.slice(2)
for (const f of files) {
    const src = readFileSync(f, "utf8")
    const id = f.replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "")
    const out = convert(src, id)
    if (!out) {
        console.log(`skip  ${f}`)
        continue
    }
    writeFileSync(f, out)
    console.log(
        `${(Buffer.byteLength(src) / 1024).toFixed(1)}K -> ${(Buffer.byteLength(out) / 1024).toFixed(1)}K  ${f}`,
    )
}
