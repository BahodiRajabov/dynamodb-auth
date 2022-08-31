import { IUser, ICreateUser } from './interface/users.interface';
import UsersDAO from '../users/dao/users.dao';

class UsersService {
   private usersDao = new UsersDAO();

   create({ full_name, email, password }: ICreateUser) {
      return this.usersDao.create({
         full_name,
         email,
         password
      });
   }

   getByEmail(email: string) {
      return this.usersDao.getByEmail(email);
   }

   getById(id: string) {
      return this.usersDao.getById(id);
   }
   verify(userId: string, createdAt: Date) {
      return this.usersDao.verify(userId, createdAt);
   }
}

export default UsersService;
