export const useBlogAuthors = (blog) => {
    const getAuthors = () => {
        if (blog.authors && blog.authors.length > 0) {
            return blog.authors;
        }
        if (blog.author) {
            return [blog.author];
        }
        return [];
    };

    const getFirstAuthorName = () => {
        const authors = getAuthors();
        return authors.length > 0 ? authors[0].name : '';
    };

    return {
        getAuthors,
        getFirstAuthorName
    };
}; 