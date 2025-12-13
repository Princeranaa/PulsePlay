import app from "./app.js";
import config from './config/config.js'
import { connectDb } from './config/databse.js'

connectDb()


app.listen(config.PORT, () => {
  console.log(`music service start on the ${config.PORT} port`);
});
