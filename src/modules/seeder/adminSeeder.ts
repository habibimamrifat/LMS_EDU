import { userRole } from "../../constents"
import { UserModel } from "../user/user.model"
import userServices from "../user/user.service"

const adminSeeder = async () => {
    const admin = {
        name:"habib",
        img:"xyz pic",
        mobileNo:"0178456754",
        email:"adm1@gmail.com",
        role: userRole.admin,
        password:"1",
    }
    // console.log("admin check ....")
    const adminExist = await UserModel.findOne({role:userRole.admin})
    if(!adminExist)
    {
        console.log("seeding admin....")
        const createAdmin = userServices.createUser(admin)
        if(!createAdmin)
        {
            throw Error ("admin coudnyt be created")
        }
    }
}

export default adminSeeder