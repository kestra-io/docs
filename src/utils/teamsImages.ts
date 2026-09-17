const TeamImagesModules = import.meta.glob<ImageMetadata>("~/assets/teams/*.{png,svg,jpg,gif,jpeg}", {
    eager: true,
    import: "default",
})

const TeamImagesMap = Object.fromEntries(Object.entries(TeamImagesModules).map(([path, module]) => {
    const fileName = path.split("/").pop() || ""
    return [fileName, module]
}))

export default TeamImagesMap