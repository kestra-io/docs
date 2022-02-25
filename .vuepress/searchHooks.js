export default {
    async processSuggestions(suggestions, queryString, queryTerms) {
        return suggestions
            .filter(item => item.frontmatter.draft === undefined || item.frontmatter.draft === false);
            // .map(r => {
            // if (r.frontmatter && r.frontmatter.icon) {
            //     r.title = "<img width=\"25\" src=\"data:image/svg+xml;base64," + r.frontmatter.icon + ">" + r.title;
            // }
            // })
    },

    async onGoToSuggestion(index, suggestion, queryString, queryTerms) {

        return true
    },
}
