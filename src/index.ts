import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import * as cors from "cors";
import {registerRoutes} from "./routes/routes";
import * as passport from 'passport';
import { Passport } from "./utility/passport";
import TYPES from "./config/types";
import container from './container/inversify.config'
import RepositoryRegister from "./Repository/RepoRegister";


const PORT = process.env.PORT || 3000;

// read connection options from ormconfig file (or ENV variables)
createConnection().then(async connection => {

    // create express app
    const app = express();
    // Call midlewares
    app.use(cors());
    app.use(helmet());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(passport.initialize());

    container.get<Passport>(TYPES.Passport).init();

    //Register custom repositories as container
    RepositoryRegister.register()


    // register express routes from defined application routes
    const routesV1=registerRoutes(app);

    // await connection.runMigrations();
    // start express server
    app.listen(PORT);

    console.log("Express server has started on port 3000");

}).catch(error => console.log(error));