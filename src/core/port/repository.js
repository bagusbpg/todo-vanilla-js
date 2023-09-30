class AbstractRepository {
    constructor() {
        if (this.constructor == AbstractRepository) {
            throw new Error("abstract class cannot be instantiated");
        }
    }

    async create(name) {
        throw new Error("method create is not implemented");
    }

    async list(filter) {
        throw new Error("method list is not implemented");
    }

    async get(id) {
        throw new Error("method get is not implemented");
    }

    async update(todo) {
        throw new Error("method update is not implemented");
    }

    async delete(id) {
        throw new Error("method delete is not implemented");
    }
}

export default AbstractRepository;