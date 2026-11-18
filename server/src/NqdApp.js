import express from "express";
import cors from "cors";
import helmet from "helmet";

import { env } from "./config/NqdEnv.js";
import routes from "./routes/NqdIndex.js";
import {
    notFound,
    errorHandler
} from "./middleware/NqdErrorHandler.js";

const app = express();

app.use(helmet());

app.use(
    cors({
        origin: env.clientOrigin
    })
);

app.use(
    express.json({
        limit: "100kb"
    })
);

app.use("/api", routes);

app.use(notFound);

app.use(errorHandler);

export default app;