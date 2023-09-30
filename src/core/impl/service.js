import AbstractService from "../port/service.js";

class Service extends AbstractService {
    constructor(repository) {
        super();

        this.repository = repository;
    }

    async create(name) {
        return this.repository.list({ name: name }).
            then(result => {
                if (result.length > 0) throw Error("todo is already exist");

                return this.repository.create(name);
            }).
            catch(error => { throw error });
    }

    async list(filter) {
        return this.repository.list(filter);
    }

    async get(id) {
        return this.repository.get(id);
    }

    async update(todo) {
        return this.repository.get(todo.id).
            then(result => {
                if (result.length == 0) throw Error("todo does not exist");

                return this.repository.update(todo);
            }).
            catch(error => { throw error });
    }

    async delete(id) {
        return this.repository.delete(id);
    }
}

export default Service;