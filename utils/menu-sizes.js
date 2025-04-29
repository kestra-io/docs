let menuSizes = {
    product : {
        xxl: {
            width: '440px',
            height: '435px',
            headerMenuTranslateX: 'calc(50vw - 600px)',
        },
        xl: {
            width: '440px',
            height: '435px',
            headerMenuTranslateX: 'calc((100vw - 780px) / 2)',
        },
        lg: {
            width: '440px',
            height: '435px',
            headerMenuTranslateX: 'calc((100vw - 780px) / 2)',
        },
        md: {
            width: '440px',
            height: '435px',
            headerMenuTranslateX: 'calc((100vw - 780px) / 2)',
        },
    },
    solutions: {
        xxl: {
            width: '1320px',
            height: '630px',
            headerMenuTranslateX: 'calc(50vw - 600px)',
        },
        xl: {
            width: '1300px',
            height: '630px',
            headerMenuTranslateX: 'calc((100vw - 1200px) / 2)',
        },
        lg: {
            width: '1250px',
            height: '630px',
            headerMenuTranslateX: 'calc((100vw - 1120px) / 2)',
        },
        md: {
            width: '1200px',
            height: '630px',
            headerMenuTranslateX: 'calc((100vw - 380px) / 2)',
        },
    },
    resources: {
        xxl: {
            width: '900px',
            height: '410px',
            headerMenuTranslateX: 'calc(50vw - 450px)',
        },
        xl: {
            width: '900px',
            height: '410px',
            headerMenuTranslateX: 'calc((100vw - 900px) / 2)',
        },
        lg: {
            width: '800px',
            height: '410px',
            headerMenuTranslateX: 'calc((100vw - 800px) / 2)',
        },
        md: {
            width: '580px',
            height: '410px',
            headerMenuTranslateX: 'calc((100vw - 580px) / 2)',
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