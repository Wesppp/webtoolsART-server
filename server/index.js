require('dotenv').config({path: __dirname + '/.env'});
const { PORT } = process.env
const DB = process.env.DB_URL.replace(
  '<PASSWORD>',
  process.env.DB_PASSWORD
)

const express = require("express")
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const passport = require("passport")
const bodyParser = require('body-parser')

app.use(express.static(__dirname + '/uploads'))
app.set('trust proxy', 1)
app.use(express.json());
app.use(bodyParser.json());
// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

const authRouter = require('./routes/auth.route')
const userRouter = require('./routes/user.route')
const articleRouter = require('./routes/artiles.router')
const categoryRouter = require('./routes/categories.route')

app.use('/api', authRouter)
app.use('/api', userRouter)
app.use('/api', articleRouter)
app.use('/api', categoryRouter)
app.get('/api/server/uploads/:slug', function(req, res){
  res.sendFile(`${__dirname}/uploads/${req.params.slug}`);
})

async function start() {
  try {
    mongoose.set("strictQuery", false);
    mongoose.connect(DB, {
      useNewUrlParser: true
    }, () => console.log('Connected to MongoDB')) 

    app.use(passport.initialize());
    require('./middlewares/jwt.middleware')(passport);

    app.use(cors())
    const server = app.listen(PORT, (error) => {
      if (error) return console.log(`Error: ${error}`);
      console.log(`Server listening on port ${server.address().port}`);
    });

  } catch(e) {
    console.log(e)
  }
}

start()