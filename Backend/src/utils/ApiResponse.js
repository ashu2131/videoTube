class ApiResponse {
    constructor(
        statusCode,
        data,
        message= "Something went wrong",
       
    ){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = true;
    }
}

export {ApiResponse}

