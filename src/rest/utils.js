export function readAll (req) {
    return new Promise((resolve, reject) => {
        try {
            let body = [];
            req.on("data", (chunk) => body.push(chunk) );
            req.on("end", () => resolve(Buffer.concat(body).toString()));
        } catch (error) {
            reject(error);
        }
    });
};

export function log(level, handler, req, data) {
    const now = new Date();
    
    const logObject = {
        timestamp: now.toLocaleString(),
        level: level || "INFO"
    };

    if (handler) {
        logObject.handler = handler;
    }

    if (req?.url) {
        logObject.url = req.url;
    }

    if (req?.method) {
        logObject.method = req.method;
    }

    if (data) {
        logObject.data = data;
    }

    console.log(JSON.stringify(logObject));
}
