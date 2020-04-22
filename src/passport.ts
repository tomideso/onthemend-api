import * as passport from 'passport';
import Account from './entity/Account';
import {JWT_CONFIG as CONFIG,Redis} from './config/index'

const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt



// Setup JWT options
const opts = {
    secretOrKey: CONFIG.jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    passReqToCallback: true
};


passport.use(new JwtStrategy(opts, async (req, jwtPayload, done)=> {

    //If the token has expired, raise unauthorized
    const expirationDate = new Date(jwtPayload.exp * 1000)

    if (expirationDate < new Date()) {
        return done(null, false);
    }

    //checks if token has been revoked manually
    const token = req.headers.authorization.split(' ')[1];

    try{

        const found= await Redis.get(token)

        if (found) {
            return done(null, false, 'Invalid Token')
        }
   }
   catch(err){

       const account = await Account.findOneOrFail({ email: jwtPayload.email })
        .catch(error=>{
            done(null, false);
        })

        if(account){
            return done(null, account);
        }
   }

}))