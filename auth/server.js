import app from "./src/app.js";
import {connectToDb} from './src/config/database.js'
import config from './src/config/config.js'
import {connect} from './src/broker/rabit.js'

connectToDb();
connect();
const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
