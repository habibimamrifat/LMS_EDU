import dotenv from "dotenv"
import path from "path"
dotenv.config({path:path.join(process.cwd(),".env")})
const config={
    port: process.env.PORT ? Number(process.env.PORT) : 4000, // Convert to number safely,
    nodeEnv:process.env.NODE_ENV,
    mongoose_uri:process.env.MONGOOSE_URI as string,
    jwt_token_secret:process.env.JWT_TOKEN_SECRET as string,
    jwt_refresh_Token_secret:process.env.JWT_REFRESHTOKEN_SECRET as string,
    stripe_secret_key:process.env.STRIPE_SECRET_KEY as string,
    token_expairsIn:process.env.TOKEN_EXPAIRS_IN as string,
    rifresh_expairsIn:process.env.REFRESH_TOKEN_EXPAIRS_IN as string
}
export default config