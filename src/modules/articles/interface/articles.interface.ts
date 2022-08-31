export interface ICreateArticle {
  title: string;
  description: string;
  is_private: boolean;
}

export interface IArticle {
  article_id: string;
  title: string;
  description: string;
  created_at: Date;
  user_id: string;
  is_private: boolean;
}

export interface IArticleIdParam {
  articleId: string;
}