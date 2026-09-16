// floatPrecision stays high: the dot pattern's pitch and anchor carry six
// significant decimals, and rounding them drifts the field by a visible
// fraction of a pixel across 160 columns.
export default {
    multipass: true,
    plugins: [
        {
            name: "preset-default",
            params: {
                floatPrecision: 6,
                overrides: { cleanupIds: false },
            },
        },
    ],
}
