import { RequestWithUser } from "../../interface/routes.interface";
import SessionDAO from "../../../auth/dao/sessions.dao";
import { IDecodedToken } from "../../../auth/interface/auth.interface";
import UsersDAO from "../../../users/dao/users.dao";
import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { server } from "../../../../config/conf";
import ErrorResponse from "../../utils/errorResponse";
import { parseJson } from "../../utils/utils";

const JWT_KEY = server.jwtKey

const protect = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    let authToken = ""
    const usersDao = new UsersDAO();
    const sessionsDao = new SessionDAO();

    const authorization = req.headers.authorization

    if (authorization && authorization.startsWith("Bearer ")) {
      authToken = authorization.split(" ")[1];
    }
    if (!authToken) throw new ErrorResponse(401, "Please login in to get access")

    const decodedToken = verify(authToken, JWT_KEY) as IDecodedToken;

    if (!decodedToken) throw new ErrorResponse(400, "Unauthorized!")
    console.log(decodedToken.userId);

    const user = await usersDao.getById(decodedToken.userId)

    if (!user) throw new ErrorResponse(401, "User does not exist")

    const session = await sessionsDao.getSessionByTokenId(decodedToken.tokenId);
    console.log(session); 

    if (parseJson(session.is_logged_out)) {
      throw new ErrorResponse(401, 'You are not logged in! Please log in to get access.')
    }

    req.user = user;

    next()

  } catch (error) {
    next(error)
  }
}

export default protect


