import { NextFunction, Request, Response } from 'express';
import ArticlesController from './articles.service';
import { CreateArticleDTO } from './dto/articles.dto';
import requestIp from 'request-ip';
import { v4 } from 'uuid';
import { ICreateArticle, IArticle } from './interface/articles.interface';
import { RequestWithUser } from '../shared/interface/routes.interface';
import { IUserIdParam } from '../users/interface/users.interface';

class AuthController {
  private articlesController = new ArticlesController();

  public create = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: CreateArticleDTO = req.body;
      const user = req.user

      const article = await this.articlesController.create(data, user);

      res.status(201).json({ success: true, data: article, message: `Article created successfuly` });
    } catch (error) {
      next(error);
    }
  };

  public updateOne = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: CreateArticleDTO = req.body;
      const user = req.user
      const params = req.params

      const article = await this.articlesController.updateOne(data, user, { articleId: params.articleId });

      res.status(200).json({ success: true, data: article, message: `Article updated successfuly` });
    } catch (error) {
      next(error);
    }
  };

  public getMyAll = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user

      const articles = await this.articlesController.getMyAll(user);

      res.status(200).json({ success: true, data: articles, message: `All articles` });
    } catch (error) {
      next(error);
    }
  };

  public getAllByUserId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const params = req.params

      const articles = await this.articlesController.getAllByUserId(params.userId);

      res.status(200).json({ success: true, data: articles, message: `All articles` });
    } catch (error) {
      next(error);
    }
  };

}

export default AuthController;
