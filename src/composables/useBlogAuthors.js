export const useBlogAuthors = (blog) => {
    const getAuthors = () => {
        if (blog.data.authors && blog.data.authors.length > 0) {
            return blog.data.authors
        }
        if (blog.data.author) {
            return [blog.data.author]
        }
        return []
    }

    const getFirstAuthorName = () => {
        const authors = getAuthors()
        return authors.length > 0 ? authors[0].name : ""
    }

    return {
        getAuthors,
        getFirstAuthorName,
    }
}