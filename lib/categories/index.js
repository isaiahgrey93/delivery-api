const { keyBy } = require("lodash");

class Category {
    constructor(args) {
        this.Entity = args.Entity;
        this.store = args.store;
    }

    initLibs(libs) {
        this.libs = libs;
    }

    async create(category) {
        let newCategory = new this.Entity(category);

        try {
            newCategory = await this.store.create(newCategory);
            if (newCategory instanceof Error) throw newCategory;

            return newCategory;
        } catch (e) {
            return e;
        }
    }

    async update(category, options = {}) {
        let updatedCategory = new this.Entity(category);

        try {
            updatedCategory = await this.store.update(updatedCategory);

            return this.populate(updatedCategory, options.populate);
        } catch (e) {
            return e;
        }
    }

    async delete(id) {
        try {
            let fetchedCategory = await this.store.delete(id);

            if (fetchedCategory instanceof Error) throw fetchedCategory;

            return fetchedCategory;
        } catch (e) {
            return e;
        }
    }

    async getById(id, options = {}) {
        try {
            let fetchedCategory = await this.store.getById(id);

            if (fetchedCategory instanceof Error) throw fetchedCategory;

            return this.populate(fetchedCategory, options.populate);
        } catch (e) {
            return e;
        }
    }

    async getAll(options = {}) {
        try {
            let fetchedCategories = await this.store.getAll();

            if (fetchedCategories instanceof Error) throw fetchedCategories;

            fetchedCategories = await Promise.all(
                fetchedCategories.map(async c => {
                    c = await this.libs.categories.populate(
                        c,
                        options.populate
                    );
                    return c;
                })
            );

            return fetchedCategories;
        } catch (e) {
            return e;
        }
    }

    async filterBy(query, options = {}) {
        try {
            let fetchedCategories = await this.store.filterBy(query);

            if (fetchedCategories instanceof Error) throw fetchedCategories;

            fetchedCategories = await Promise.all(
                fetchedCategories.map(async c => {
                    c = await this.libs.categories.populate(
                        c,
                        options.populate
                    );
                    return c;
                })
            );

            return fetchedCategories;
        } catch (e) {
            throw e;
        }
    }

    async populate(category, relations) {
        let { presets } = keyBy(relations);

        if (presets) {
            let categoryPresets = await this.libs.presets.filterBy({
                categoryId: category.id
            });

            category.presets = categoryPresets;
        }

        return category;
    }
}

module.exports = Category;
