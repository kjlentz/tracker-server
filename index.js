const express = require("express");
const cookieParser = require("cookie-parser");

const PORT = 4000;

const auth = require("./auth/auth.middlewares");
const authRouter = require("./auth/auth.router");
const travelsRouter = require("./travels/travels.router");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(auth.checkTokenSetUser);


app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'POST, PUT');
        return res.status(200).json({});
    };
  	next();
});


//AUTH Route
app.use('/auth', authRouter);

app.use("/travel", auth.isLoggedIn, travelsRouter);





function errorHandler(err, req, res, next){
	res.status(res.statusCode || 500);

	let stack;
	if(process.env.NODE_ENV !== 'production') { stack = err.stack; }

	res.json({
		error: true,
		message: err.message,
		stack
	})
}

app.use(errorHandler);



app.listen(PORT, () => {
    console.log("Tracker server listening on port " + PORT);
});