import AuthController from "../controller/AccountController";
import UserController from "../controller/UserProfileController";
import {Router, Application} from 'express'
import * as passport from 'passport'


const publicRoutes = [{
    route: "/account",
    controller: AuthController,
}];


const privateRoutes = [{
    route: "/user",
    controller: UserController,
}];

export const registerRoutes= (app:Application):void=>{
    const routesV1 = Router();

    publicRoutes.map(({route,controller})=>{
        routesV1.use(route,controller())
    })
    
    privateRoutes.map(({route,controller})=>{
        routesV1.use(route,passport.authenticate('jwt', { session: false }),controller())
    });

    app.use('/v1',routesV1);
}