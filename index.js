const express = require("express");
const { graphqlHTTP } = require('express-graphql');
const cookieParser = require("cookie-parser");
const { buildSchema } = require("graphql");

const PORT = 4000;

const auth = require("./auth/auth.middlewares");
const authRouter = require("./auth/auth.router");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(auth.checkTokenSetUser);


app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'POST');
        return res.status(200).json({});
    };
  	next();
});


//AUTH Route
app.use('/auth', authRouter);




/* ------ GRAPHQL ------ */
const { application } = require("./graphql");

const execute = application.createExecution();
const schema = application.schema;


app.use('/graphql',
    auth.isLoggedIn,
    express.json(),
    graphqlHTTP(req => ({
        schema,
        context: req,
        customExecuteFn: execute,
        graphiql: false,
})));

app.listen(PORT, () => {
    console.log("Tracker server listening on port " + PORT);
});