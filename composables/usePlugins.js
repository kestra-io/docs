import { useState } from "#imports";

export const usePlugins = () => {
    const page = useState("ks-page", () => ({}));

    const pluginsToPageList = (plugins) => {
        const pageList = plugins.map(plugin => {
            const titleCapitalized =
                plugin.title.charAt(0).toUpperCase() + plugin.title.slice(1);
            const categories = [
                'tasks',
                'triggers',
                'conditions',
                'controllers',
                'storages',
                'secrets',
                'guides'
            ];
            const children = categories.filter(category => plugin[category].length > 0)
                .map(category => ({
                    _path: `/plugins/${plugin.name}/${category.toLowerCase()}`,
                    title: category.charAt(0).toUpperCase() + category.slice(1),
                    children: plugin[category].map(subCategory => {
                        const subCategoryParts = subCategory.split('.');
                        const subCategoryTitle = subCategoryParts[subCategoryParts.length - 1];
                        return {
                            _path: `/plugins/${plugin.name}/${category.toLowerCase()}/${subCategoryTitle.toLowerCase()}`,
                            title: subCategoryTitle,
                        }
                    })
                }))
            return {
                _path: `/plugins/${plugin.name}`,
                title: titleCapitalized,
                children
            }
        });
        return pageList.sort((a, b) => {
            const nameA = a.title.toLowerCase();
            const nameB = b.title.toLowerCase();

            if (nameA === 'core') return -1;
            if (nameB === 'core') return 1;

            return nameA.localeCompare(nameB);
        });
    }

    return {
        page,
        pluginsToPageList
    };
};
