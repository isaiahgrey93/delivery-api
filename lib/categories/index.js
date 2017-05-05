class Category {
    constructor(args) {
        super();
        this.Entity = args.Entity;
        this.store = args.store;
    }

    async create(drive) {
        let newCategory = new this.Entity(drive);

        try {
            newCategory = await this.store.create(newCategory);
            if (newCategory instanceof Error) throw newCategory;

            return newCategory;
        } catch (e) {
            return e;
        }
    }

    async update(drive) {
        let updatedCategory = new this.Entity(drive);

        try {
            return await this.store.update(updatedCategory);
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

    async getById(id) {
        try {
            let fetchedCategory = await this.store.getById(id);

            if (fetchedCategory instanceof Error) throw fetchedCategory;

            return fetchedCategory;
        } catch (e) {
            return e;
        }
    }

    async getAll() {
        try {
            let fetchedCategories = await this.store.getAll();

            if (fetchedCategories instanceof Error) throw fetchedCategories;

            return fetchedCategories;
        } catch (e) {
            return e;
        }
    }
}

module.exports = Category;
