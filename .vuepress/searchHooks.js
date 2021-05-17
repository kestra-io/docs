export default {
    async processSuggestions(suggestions, queryString, queryTerms) {
        return suggestions.map(r => {
            if (r.frontmatter && r.frontmatter.icon) {
                r.title = "<img width=\"25\" src=\"data:image/svg+xml;base64," + r.frontmatter.icon + ">" + r.title;
            }

            return r;
        })
    },

    async onGoToSuggestion(index, suggestion, queryString, queryTerms) {

        return true
    },
}
