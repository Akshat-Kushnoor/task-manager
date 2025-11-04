const asyncHandler = (requestHandler => async (req, res, next) => {
    try {
        await requestHandler(req, res, next);
    } catch (error) {
        next(error); // Error Handleing Must revisit
    }
});

module.exports = asyncHandler;