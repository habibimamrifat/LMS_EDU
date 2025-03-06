import catchAsync from "../../util/catchAsync";
import authSercvices from "./auth.services";

const logIn = catchAsync(async (req, res) => {
    const { email, password } = req.body
    const result = await authSercvices.logIn(email, password)
    const { approvalToken, refreshToken, modifyFindUserAndUpdate } = result

    res.status(200).json({
        message: "Log In Successful",
        approvalToken: approvalToken,
        refreshToken: refreshToken,
        user: modifyFindUserAndUpdate
    })
})


const logOut = catchAsync(async (req, res) => {
    const userId = req?.user.id
  

    if (!userId) {
        throw Error("token is missing")
    }
    
    const result = await authSercvices.logOut(userId)
    res.status(200).json({
        message: "Log OUT Successful",
    })
})

const authController = {
    logIn, logOut
}
export default authController