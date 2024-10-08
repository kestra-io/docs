let menuSizes = {
    product : {
        xxl: {
            width: '780px',
            height: '560px',
            headerMenuTranslateX: '400px',
        },
        xl: {
            width: '780px',
            height: '560px',
            headerMenuTranslateX: '50px',
        },
        lg: {
            width: '780px',
            height: '560px',
            headerMenuTranslateX: '50px',
        },
        headerArrowTranslateX: -332
    },
    solutions: {
        xxl: {
            width: '1560px',
            height: '623px',
            headerMenuTranslateX: '150px',
        },
        xl: {
            width: '1560px',
            height: '623px',
            headerMenuTranslateX: '150px',
        },
        lg: {
            width: '1560px',
            height: '623px',
            headerMenuTranslateX: '150px',
        },
        headerArrowTranslateX: -232
    },
    resources: {
        xxl: {
            width: '1200px',
            height: '560px',
            headerMenuTranslateX: '370px',
        },
        xl: {
            width: '1200px',
            height: '560px',
            headerMenuTranslateX: '370px',
        },
        lg: {
            width: '1200px',
            height: '560px',
            headerMenuTranslateX: '370px',
        },
        headerArrowTranslateX: 2
    }
};
const getBreakpoint = (size) => {
    if (size < 1200) {
        return 'lg';
    } else if (size >= 1200 && size < 1400) {
        return 'xl';
    } else if (size >= 1400) {
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
        headerArrowTranslateX: menuSizes[name].headerArrowTranslateX,
        headerMenuTranslateX: menuSizes[name][getBreakpoint(size)].headerMenuTranslateX,
    }
}