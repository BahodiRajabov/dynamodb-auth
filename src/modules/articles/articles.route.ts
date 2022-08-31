import validate from '../shared/middlewares/validate';
import { Router } from 'express';
import { Routes } from '../shared/interface/routes.interface';
import ArticlesController from './articles.controller';
import { CreateArticleDTO } from './dto/articles.dto';
import protect from '../shared/middlewares/auth/protect';

export default class ArticleRoute implements Routes {
  public path = '/articles/';
  public router = Router();
  public articleController = new ArticlesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, protect, validate(CreateArticleDTO, "body"), this.articleController.create);
    this.router.put(`${this.path}:articleId`, protect, validate(CreateArticleDTO, "body", true), this.articleController.updateOne);
    this.router.get(`${this.path}`, protect, this.articleController.getMyAll);
    this.router.get(`${this.path}:userId`, this.articleController.getAllByUserId);
  }
}
