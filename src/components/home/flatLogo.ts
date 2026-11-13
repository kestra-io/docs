// Every fill takes the text color, so each logo reads in both themes. Masks
// keep their own fills, or they would hide the drawing.
export const flat = (svg: string) => {
    const [head, body] = svg.includes("</mask>")
        ? [
              svg.slice(0, svg.lastIndexOf("</mask>")),
              svg.slice(svg.lastIndexOf("</mask>")),
          ]
        : ["", svg]
    return head + body.replace(/fill="(?!none)[^"]+"/gi, 'fill="currentColor"')
}
