import { editionLabelAndColorByPrefix } from "../../../utils/badgeMaps.mjs"

export function badge(data, attributes, node) {
    const { version, editions } = attributes
    if (!version && !editions) {
        throw new Error("badge directive requires either version or editions attributes")
    }
    const editionList = editions ? editions.split(",").map((e) => e.trim()) : []
    data.hName = "div"
    data.hProperties = {
        class: `fw-bold d-flex gap-2 flex-wrap mb-3`,
    }
    node.children = [
        // <p class="mb-0">Available on:</p>
        {
            type: "element",
            data: {
                hName: "p",
                hProperties: {
                    class: "mb-0",
                },
            },
            children: [
                {
                    type: "text",
                    value: "Available on:",
                },
            ],
        },
        // <span class="badge bg-dark">v{{ version }}</span>
        ...(version
            ? [
                  {
                      type: "element",
                      data: {
                          hName: "span",
                          hProperties: {
                              class: "badge d-flex align-items-center bg-body-tertiary",
                          },
                      },
                      children: [
                          {
                              type: "text",
                              value: `v${version}`,
                          },
                      ],
                  },
              ]
            : []),
        // <span class="badge d-flex align-items-center" :class="`bg-${editionInfo(edition).color}`">
        ...editionList.map((edition) => {
            const info = editionLabelAndColorByPrefix?.[edition] || {
                label: edition,
                color: "secondary",
            }
            return {
                type: "element",
                data: {
                    hName: "span",
                    hProperties: {
                        class: `badge d-flex align-items-center bg-${info.color}`,
                    },
                },
                children: [
                    {
                        type: "text",
                        value: info.label,
                    },
                ],
            }
        }),
    ]
}