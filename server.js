const dotenv = require('dotenv');
const app = require('./app');

dotenv.config();
const PORT = process.env.PORT_LISTEN;

app.listen(PORT, () => {
  console.log(`server running at port ${PORT}`);
});
