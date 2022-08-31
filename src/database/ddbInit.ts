import otpsParam from '../modules/auth/models/sessions.model';
import sessionsParam from '../modules/auth/models/otps.model';
import usersParam from '../modules/users/models/users.model';
import articlesParam from '../modules/articles/models/articles.model';

import ddbClient from '../database/ddbClient'

const tableParams = [otpsParam, usersParam, sessionsParam, articlesParam]

const ddbInit = async () => {

  await Promise.all([
    tableParams.map(table => {
      return (
        ddbClient
          .instance
          .createTable(table)
          .promise()
          .catch(err => console.error(`Unable to create table: ${table.TableName} `)
          )
          .then(data => data &&
            console.info(` Table created: ${table.TableName} `)
          )
      )
    })
  ])

}

export default ddbInit