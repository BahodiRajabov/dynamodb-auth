import { Router } from 'express';

import AuthRoute from './modules/auth/auth.route';
import ArticleRoute from './modules/articles/articles.route';

const router = Router()

const authRoute = new AuthRoute()
const articleRoute = new ArticleRoute()

router.use("/", authRoute.router)
router.use("/", articleRoute.router)

export default router