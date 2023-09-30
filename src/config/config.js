export const config = {
    app: {
        port: 8000,
        shutdownTimeout: 10000
    },
    db: {
        host: "localhost",
        user: "root",
        password: "jaladri2401",
        database: "test",
        connectionLimit: 10,
        maxIdle: 10
    }
};