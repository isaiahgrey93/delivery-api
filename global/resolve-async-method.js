const resolveAsyncMethod = asyncFnCall => {
    return new Promise(async resolve => {
        try {
            let response = (await asyncFnCall) || {};

            if (response.result !== undefined || response.error !== undefined) {
                return resolve(response);
            }

            resolve({
                result: response
            });
        } catch (err) {
            if (err.result !== undefined || err.error !== undefined) {
                return resolve(err);
            }

            resolve({
                error: err
            });
        }
    });
};

global.resolve = resolveAsyncMethod;
