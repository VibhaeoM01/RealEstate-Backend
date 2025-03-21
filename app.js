import express from "express"; // Importing the express module
import cors from "cors"; // Importing the CORS module to handle Cross-Origin Resource Sharing
import postRoute from "./routes/post.route.js"; // Importing the post routes
import authRoute from "./routes/auth.route.js"; // Importing the authentication routes
import cookieParser from "cookie-parser"; // Importing the cookie-parser module to parse cookies
import testRoute from "./routes/test.route.js"; // Importing the test routes
import userRoute from "./routes/user.route.js"; 
const app = express(); // Creating an instance of express

// Middleware to enable CORS with specific origin and credentials
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// Middleware to parse JSON bodies
app.use(express.json());
 
// Middleware to parse cookies
app.use(cookieParser());

app.use("/api/users", userRoute);

// Mounting the post routes at /api/post
app.use("/api/posts", postRoute);

// Mounting the authentication routes at /api/auth
app.use("/api/auth", authRoute);

// Mounting the test routes at /api/test
app.use("/api/test", testRoute);



// Starting the server on port 3000
app.listen(3000, () => {
    console.log("Server is running");
});