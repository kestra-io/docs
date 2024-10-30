let menuSizes = {
    product : {
        xxl: {
            width: '780px',
            height: '560px',
            headerMenuTranslateX: 'calc(50vw - 600px)',
            headerArrowTranslateX: -344
        },
        xl: {
            width: '780px',
            height: '560px',
            headerMenuTranslateX: 'calc((100vw - 780px) / 2)',
            headerArrowTranslateX: -332
        },
        lg: {
            width: '780px',
            height: '560px',
            headerMenuTranslateX: 'calc((100vw - 780px) / 2)',
            headerArrowTranslateX: -315
        },
    },
    solutions: {
        xxl: {
            width: '1560px',
            height: '690px',
            headerMenuTranslateX: 'calc(50vw - 780px)',
            headerArrowTranslateX: -266
        },
        xl: {
            width: '1347px',
            height: '653px',
            headerMenuTranslateX: 'calc((100vw - 1347px) / 2)',
            headerArrowTranslateX: -252
        },
        lg: {
            width: '950px',
            height: '653px',
            headerMenuTranslateX: 'calc((100vw - 950px) / 2)',
            headerArrowTranslateX: -244
        },
    },
    resources: {
        xxl: {
            width: '1200px',
            height: '580px',
            headerMenuTranslateX: 'calc(50vw - 600px)',
            headerArrowTranslateX: -177
        },
        xl: {
            width: '1200px',
            height: '580px',
            headerMenuTranslateX: 'calc((100vw - 1200px) / 2)',
            headerArrowTranslateX: -165
        },
        lg: {
            width: '1000px',
            height: '580px',
            headerMenuTranslateX: 'calc((100vw - 1000px) / 2)',
            headerArrowTranslateX: -160
        },
    }
};
const getBreakpoint = (size) => {
    if (size <= 1200) {
        return 'lg';
    } else if (size > 1200 && size < 1570) {
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