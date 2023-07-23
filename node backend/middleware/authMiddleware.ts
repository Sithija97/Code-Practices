import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import { NextFunction, Response } from "express";
import { CustomRequest } from "../interfaces/index.js";

const protect = asyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    let token: string;
    token = req.cookies.jwt;

    if (token) {
      try {
        const decode: any = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decode.userId).select("-password");
        next();
      } catch (error) {
        res.status(401);
        throw new Error("Unauthorized, invalid token");
      }
    } else {
      res.status(401);
      throw new Error("Unauthorized, no token");
    }
  }
);

export { protect };
