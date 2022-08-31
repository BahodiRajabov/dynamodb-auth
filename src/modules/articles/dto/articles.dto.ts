import {
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import {
  ICreateArticle,
} from '../interface/articles.interface';

export class CreateArticleDTO implements ICreateArticle {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsBoolean()
  is_private: boolean;

}