let menuSizes = {
    product : {
        xxl: {
            width: '780px',
            height: '560px',
            headerMenuTranslateX: 'calc(50vw - 600px)',
            headerArrowTranslateX: -347
        },
        xl: {
            width: '780px',
            height: '560px',
            headerMenuTranslateX: 'calc((100vw - 780px) / 2)',
            headerArrowTranslateX: -348
        },
        lg: {
            width: '780px',
            height: '560px',
            headerMenuTranslateX: 'calc((100vw - 780px) / 2)',
            headerArrowTranslateX: -335
        },
        md: {
            width: '780px',
            height: '560px',
            headerMenuTranslateX: 'calc((100vw - 780px) / 2)',
            headerArrowTranslateX: -310
        },
    },
    solutions: {
        xxl: {
            width: '1560px',
            height: '690px',
            headerMenuTranslateX: 'calc(50vw - 780px)',
            headerArrowTranslateX: -262
        },
        xl: {
            width: '1347px',
            height: '653px',
            headerMenuTranslateX: 'calc((100vw - 1347px) / 2)',
            headerArrowTranslateX: -270
        },
        lg: {
            width: '950px',
            height: '653px',
            headerMenuTranslateX: 'calc((100vw - 950px) / 2)',
            headerArrowTranslateX: -255
        },
        md: {
            width: '780px',
            height: '560px',
            headerMenuTranslateX: 'calc((100vw - 780px) / 2)',
            headerArrowTranslateX: -240
        },
    },
    resources: {
        xxl: {
            width: '1200px',
            height: '580px',
            headerMenuTranslateX: 'calc(50vw - 600px)',
            headerArrowTranslateX: -173
        },
        xl: {
            width: '1200px',
            height: '580px',
            headerMenuTranslateX: 'calc((100vw - 1200px) / 2)',
            headerArrowTranslateX: -177
        },
        lg: {
            width: '1000px',
            height: '580px',
            headerMenuTranslateX: 'calc((100vw - 1000px) / 2)',
            headerArrowTranslateX: -165
        },
        md: {
            width: '780px',
            height: '560px',
            headerMenuTranslateX: 'calc((100vw - 780px) / 2)',
            headerArrowTranslateX: -165
        }
    }
};
const getBreakpoint = (size) => {
    if (size <= 1040) {
        return 'md';
    } else if  (size > 1040 && size < 1400) {
        return 'lg';
    } else if (size > 1400 && size < 1570) {
        return 'xl';
    } else if (size >= 1570) {
        return 'xxl';
    } else {
        return 'xxl';
    }
}

export function menuSize(name, size) {
    return {
        size: {
            width: menuSizes[name][getBreakpoint(size)].width,
            height: menuSizes[name][getBreakpoint(size)].height
        },
        headerArrowTranslateX: menuSizes[name][getBreakpoint(size)].headerArrowTranslateX,
        headerMenuTranslateX: menuSizes[name][getBreakpoint(size)].headerMenuTranslateX,
    }
}