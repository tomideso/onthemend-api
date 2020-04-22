// import { getRepository } from "typeorm";
import { NextFunction, Request, Response, Router } from "express";
import { validate } from 'class-validator'
import UserProfile from "../entity/UserProfile";
import { checkRole } from "../middleware/checkRole";



export default () => {

    let router = Router();

    router.get('/all',checkRole(['superadmin']), async (req: Request, res: Response, next: NextFunction) => {

        const users = await UserProfile.find()
            .catch(err => res.status(409).send("Invalid request."));

        return res.send({users});

    });



    router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {

        const user = await UserProfile.findOneOrFail(req.params.id)
            .catch(err => res.send("Cannot find users"))
            res.send(user);
    });



    router.post('/', async (req: Request, res: Response, next: NextFunction) => {
       const { firstName, lastName, age,account } = req.body
       const userObject = { firstName, lastName, age,account };  
        
        const errors = await validate(userObject);

        if (errors.length > 0) {
            return res.status(400).send(errors);
        }

        const user = await UserProfile.create(userObject).save()
            .catch(err => res.send("Error creating user."));

        return res.send(user);
    })


    router.delete('/:id',checkRole(['superadmin']), async (req: Request, res: Response, next: NextFunction) => {

        const user = await UserProfile.findOneOrFail(req.params.id)
                              .catch(err => res.send("User with such id does not exist"));

        await this.userRepository.remove(user);
        
        return res.send("User deleted successfully");
     })
 


    return router;
}
