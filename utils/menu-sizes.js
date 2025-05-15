let menuSizes = {
    product : {
        xxl: {
            width: '420px',
            height: '435px',
            headerMenuTranslateX: 'calc(50vw - 600px)',
            headerArrowTranslateX: -360
        },
        xl: {
            width: '420px',
            height: '435px',
            headerMenuTranslateX: 'calc((100vw - 780px) / 2)',
            headerArrowTranslateX: -360
        },
        lg: {
            width: '420px',
            height: '435px',
            headerMenuTranslateX: 'calc((100vw - 780px) / 2)',
            headerArrowTranslateX: -300
        },
        md: {
            width: '420px',
            height: '435px',
            headerMenuTranslateX: 'calc((100vw - 780px) / 2)',
            headerArrowTranslateX: -300
        },
    },
    solutions: {
        xxl: {
            width: '1240px',
            height: '630px',
            headerMenuTranslateX: 'calc(50vw - 780px)',
            headerArrowTranslateX: -250
        },
        xl: {
            width: '1240px',
            height: '630px',
            headerMenuTranslateX: 'calc((100vw - 1347px) / 2)',
            headerArrowTranslateX: -250
        },
        lg: {
            width: '1240px',
            height: '630px',
            headerMenuTranslateX: 'calc((100vw - 1347px) / 2)',
            headerArrowTranslateX: -180
        },
        md: {
            width: '1240px',
            height: '630px',
            headerMenuTranslateX: 'calc((100vw - 1347px) / 2)',
            headerArrowTranslateX: -170
        },
    },
    resources: {
        xxl: {
            width: '815px',
            height: '410px',
            headerMenuTranslateX: 'calc(50vw - 450px)',
            headerArrowTranslateX: -150
        },
        xl: {
            width: '815px',
            height: '410px',
            headerMenuTranslateX: 'calc((100vw - 900px) / 2)',
            headerArrowTranslateX: -150
        },
        lg: {
            width: '760px',
            height: '410px',
            headerMenuTranslateX: 'calc((100vw - 800px) / 2)',
            headerArrowTranslateX: -80
        },
        md: {
            width: '580px',
            height: '410px',
            headerMenuTranslateX: 'calc((100vw - 780px) / 2)',
            headerArrowTranslateX: -80
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