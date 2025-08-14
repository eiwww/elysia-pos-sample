import { Elysia, status } from "elysia";
import { cors } from "@elysiajs/cors";
import { jwt } from "@elysiajs/jwt";
import { staticPlugin } from "@elysiajs/static";
import { swagger } from "@elysiajs/swagger";
import { MainRoute } from "./routes/index.route";
import { response } from "./database/responseHandle"
import { AuthenticationError } from "./exceptions/AuthenticationError";
import { AuthorizationError } from "./exceptions/AuthorizationError";
import { InvariantError } from "./exceptions/InvariantError";

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .use(cors())
  .use(swagger({
    path: "/api-docs",
  }))
  .use(staticPlugin({
    assets: "images",
    prefix: "/image",
  }))
  .use(jwt({
    name: "auth",
    secret: Bun.env.JWT_SECRET || "default_secret",
    exp: "1d",
  }))
  .error('AUTHENTICATION_ERROR', AuthenticationError)
  .error('AUTHORIZATION_ERROR', AuthorizationError)
  .error('INVARIANT_ERROR', InvariantError)
  .onError(({ code, error, set }) => {
    switch (code) {
      case 'AUTHENTICATION_ERROR':
        set.status = 401
        return {
          status: "error",
          message: error.message
        }
      case 'AUTHORIZATION_ERROR':
        set.status = 403
        return {
          status: "error",
          message: error.message
        }
      case 'INVARIANT_ERROR':
        set.status = 400
        return {
          status: "error",
          message: error.message
        }
      case 'VALIDATION':
        set.status = 400
        return {
          status: "error",
          message: error
        }
      case 'NOT_FOUND':
        set.status = 404
        return {
          status: "error",
          message: error.message
        }
      case 'INTERNAL_SERVER_ERROR':
        set.status = 500
        return {
          status: "error",
          message: "Something went wrong!"
        }
      case 'PARSE':
        set.status = 400
        return {
          status: "error",
          message: error.message
        }
      case 'INVALID_FILE_TYPE':
        set.status = 400
        return {
          status: "error",
          message: error.message
        }
      case 'UNKNOWN':
        set.status = 400
        return {
          status: "error",
          message: error.message
        }
      case 'INVALID_COOKIE_SIGNATURE':
        set.status = 400
        return {
          status: "error",
          message: error.message
        }
      default:
        const errorMessage = response.ErrorResponse(set, error);
        set.status = errorMessage.status
        return {
          status: 'error',
          message: errorMessage.message
        }
    }
  })
  .group("/api/v1", MainRoute)
  .listen({
    port: Bun.env.PORT || 5001,
    hostname: "0.0.0.0",
  });

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);