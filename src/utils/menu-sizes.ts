interface MenuSizeConfig {
    [key: string]: {
        [breakpoint in "md" | "lg" | "xl" | "xxl"]: {
            width: string
            height: string
            headerMenuTranslateX: string
            headerArrowTranslateX: number
        }
    }
}

type Breakpoint = "md" | "lg" | "xl" | "xxl"

interface MenuSizeResult {
    size: {
        width: string
        height: string
    }
    headerArrowTranslateX: number
    headerMenuTranslateX: string
}

const menuSizes: MenuSizeConfig = {
    product: {
        xxl: {
            width: "420px",
            height: "350px",
            headerMenuTranslateX: "calc((100vw - 1160px) / 2)",
            headerArrowTranslateX: -475,
        },
        xl: {
            width: "420px",
            height: "350px",
            headerMenuTranslateX: "calc((100vw - 780px) / 2)",
            headerArrowTranslateX: -285,
        },
        lg: {
            width: "420px",
            height: "350px",
            headerMenuTranslateX: "calc((100vw - 780px) / 2)",
            headerArrowTranslateX: -300,
        },
        md: {
            width: "420px",
            height: "350px",
            headerMenuTranslateX: "calc((100vw - 780px) / 2)",
            headerArrowTranslateX: -280,
        },
    },
    solutions: {
        xxl: {
            width: "1240px",
            height: "630px",
            headerMenuTranslateX: "calc(((100vw - 1240px) / 2))",
            headerArrowTranslateX: -360,
        },
        xl: {
            width: "1240px",
            height: "630px",
            headerMenuTranslateX: "calc(((100vw - 1240px) / 2))",
            headerArrowTranslateX: -170,
        },
        lg: {
            width: "1000px",
            height: "630px",
            headerMenuTranslateX: "calc(((100vw - 1000px) / 2))",
            headerArrowTranslateX: -180,
        },
        md: {
            width: "900px",
            height: "630px",
            headerMenuTranslateX: "calc((100vw - 950px))",
            headerArrowTranslateX: -170,
        },
    },
    resources: {
        xxl: {
            width: "815px",
            height: "410px",
            headerMenuTranslateX: "calc((100vw - 1280px) / 2)",
            headerArrowTranslateX: -265,
        },
        xl: {
            width: "815px",
            height: "410px",
            headerMenuTranslateX: "calc((100vw - 900px) / 2)",
            headerArrowTranslateX: -75,
        },
        lg: {
            width: "800px",
            height: "410px",
            headerMenuTranslateX: "calc((100vw - 800px) / 2)",
            headerArrowTranslateX: -80,
        },
        md: {
            width: "780px",
            height: "410px",
            headerMenuTranslateX: "calc((100vw - 780px) / 2)",
            headerArrowTranslateX: -80,
        },
    },
}
const getBreakpoint = (size: number): Breakpoint => {
    if (size < 992) {
        return "md"
    } else if (size < 1200) {
        return "lg"
    } else if (size < 1400) {
        return "xl"
    } else {
        return "xxl"
    }
}

export function menuSize(name: string, size: number): MenuSizeResult {
    return {
        size: {
            width: menuSizes[name][getBreakpoint(size)].width,
            height: menuSizes[name][getBreakpoint(size)].height,
        },
        headerArrowTranslateX: menuSizes[name][getBreakpoint(size)].headerArrowTranslateX,
        headerMenuTranslateX: menuSizes[name][getBreakpoint(size)].headerMenuTranslateX,
    }
}