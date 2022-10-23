const handleSetupPromise = (promise) => {
    return promise.then((data) => {
        console.log(data);
    }).catch((error) => {
        console.log(error.description);
    });
};

module.exports = handleSetupPromise
