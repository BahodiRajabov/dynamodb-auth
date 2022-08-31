import { NextFunction, Request, Response } from 'express';
import ErrorResponse from '../../shared/utils/errorResponse';


const errorHandler = (error: ErrorResponse, req: Request, res: Response, next: NextFunction) => { 
   
  const ErrorObject = { 
      error: error,
      message: error.message || error.message || "Something went wrong!",
      success: false
    }
    console.log(ErrorObject);
    
    res.status(error.status || 500).send(ErrorObject)
}

export default errorHandler