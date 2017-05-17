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

        newCategory = await resolve(this.store.create(newCategory));

        if (newCategory.error) {
            return {
                error: newCategory.error
            };
        }

        newCategory = newCategory.result;

        return {
            result: newCategory
        };
    }

    async update(category, options = {}) {
        let updatedCategory = new this.Entity(category);

        updatedCategory = await resolve(this.store.update(updatedCategory));

        if (updatedCategory.error) {
            return {
                error: updatedCategory.error
            };
        }

        updatedCategory = updatedCategory.result;

        updatedCategory = resolve(
            this.populate(updatedCategory, options.populate)
        );

        if (updatedCategory.error) {
            return {
                error: updatedCategory.error
            };
        }

        updatedCategory = updatedCategory.result;

        return {
            result: updatedCategory
        };
    }

    async delete(id) {
        let fetchedCategory = await resolve(this.store.delete(id));

        if (fetchedCategory.error) {
            return {
                error: fetchedCategory.error
            };
        }

        fetchedCategory = fetchedCategory.result;

        return {
            result: fetchedCategory
        };
    }

    async getById(id, options = {}) {
        let fetchedCategory = await resolve(this.store.getById(id));

        if (fetchedCategory.error) {
            return {
                error: fetchedCategory.error
            };
        }

        fetchedCategory = fetchedCategory.result;

        fetchedCategory = resolve(
            this.populate(fetchedCategory, options.populate)
        );

        if (fetchedCategory.error) {
            return {
                error: fetchedCategory.error
            };
        }

        fetchedCategory = fetchedCategory.result;

        return {
            result: fetchedCategory
        };
    }

    async getAll(options = {}) {
        let fetchedCategories = await resolve(this.store.getAll());

        if (fetchedCategories.error) {
            return {
                error: fetchedCategories.error
            };
        }

        fetchedCategories = fetchedCategories.result;

        fetchedCategories = await Promise.all(
            fetchedCategories.map(async c => {
                c = await resolve(
                    this.libs.categories.populate(c, options.populate)
                );

                if (c.error) {
                    return c.error;
                }

                return c.result;
            })
        );

        return {
            result: fetchedCategories
        };
    }

    async filterBy(query, options = {}) {
        let fetchedCategories = await resolve(this.store.filterBy(query));

        if (fetchedCategories.error) {
            return {
                error: fetchedCategories.error
            };
        }

        fetchedCategories = fetchedCategories.result;

        fetchedCategories = await Promise.all(
            fetchedCategories.map(async c => {
                c = await resolve(
                    this.libs.categories.populate(c, options.populate)
                );

                if (c.error) {
                    return c.error;
                }

                return c.result;
            })
        );

        return {
            result: fetchedCategories
        };
    }

    async populate(category, relations) {
        let { presets } = keyBy(relations);

        if (presets) {
            let categoryPresets = await resolve(
                this.libs.presets.filterBy({
                    categoryId: category.id
                })
            );

            if (!categoryPresets.error) {
                category.presets = categoryPresets.result;
            }
        }

        return category;
    }
}

module.exports = Category;
