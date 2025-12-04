export class apiError extends Error {

/*must handle differently for different instances :
    for controllers and routes => throw new apiError(404,"Route not found");
    else throw normal error
    must reconsider
    
    

*/

    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        super(message)
        this.statusCode = statusCode;            
        this.data = null
        this.message = message;
        this.error = errors;
        this.stack = stack;
        this.success = false;

        if(stack) {
            this.stack = stack;
            
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
};

