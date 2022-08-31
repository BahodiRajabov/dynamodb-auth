import http from 'http';
import ExpressApp from "./src/app";
import ddbInit from "./src/database/ddbInit";
import routes from "./src/app.routes";

// ;((async () => {
//   await ddbInit()

//   console.log("NIMADIR BOLDI DBGA");
  
// })())

const app = new ExpressApp(routes)

// _________LISTEN PORT___________
const port = process.env.PORT || 5000

app.listen()