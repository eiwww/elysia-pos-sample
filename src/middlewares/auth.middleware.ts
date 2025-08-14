import { AuthorizationError } from "../exceptions/AuthorizationError";

export const auth = {
    IsAuthorized: async (ctx: any ) => {
        let authorization = ctx.headers.authorization;
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new AuthorizationError("Unauthorized");
        }
        const token = authorization.split(' ')[1]
        const user = await ctx.auth.verify(token);
        if(!user) {
            throw new AuthorizationError("Unauthorized");
        }
        ctx.loginUser = user;
    }
}