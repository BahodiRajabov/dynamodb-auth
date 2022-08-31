import { IArticle, IArticleIdParam, ICreateArticle } from './interface/articles.interface';
import ErrorResponse from '../../modules/shared/utils/errorResponse';
import ArticlesDAO from './dao/articles.dao';
import { v4 } from 'uuid';
import { IUser } from '../users/interface/users.interface';

class AuthService {
  private articlesDao = new ArticlesDAO();

  async create(data: ICreateArticle, user: IUser) {

    const newArticle = await this.articlesDao.create(data, user.user_id)

    return newArticle
  }

  async updateOne(data: Partial<ICreateArticle>, user: IUser, params: IArticleIdParam) {

    const article = await this.articlesDao.getById(params.articleId)

    if (!article) throw new ErrorResponse(400, "Invalid article id")

    if (article.user_id !== user.user_id) throw new ErrorResponse(403, "You don't have permission to edit this resource")

    const updatedItem = await this.articlesDao.updateById(article, data)

    return updatedItem
  }

  async getMyAll(user: IUser) {

    const articles = await this.articlesDao.getAllByUserId(user.user_id, "all")

    return articles
  }

  async getAllByUserId(userId: string) {

    const articles = await this.articlesDao.getAllByUserId(userId, "publics")

    return articles
  }

}

export default AuthService;
