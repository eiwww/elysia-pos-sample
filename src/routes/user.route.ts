import { Elysia, t } from "elysia";
import { UserCtrl } from "../controllers/user.ctrl";
import { auth } from "../middlewares/auth.middleware";

export function UserRoute(app: Elysia) {
    return app
        .post("/login", UserCtrl.login, {
            body: t.Object({
                username: t.String(),
                password: t.String()
            }),
            detail: {
                tags: ["User"],
            }
        })
        .get("/current", UserCtrl.getCurrentUser, {
            beforeHandle: auth.IsAuthorized,
            headers: t.Object({
                authorization: t.String()
            }),
            detail: {
                tags: ["User"],
            }
        })
        .post("/", UserCtrl.createUser, {
            body: t.Object({
                username: t.String(),
                password: t.String(),
                name: t.String(),
                telephone: t.String(),
                role: t.Optional(t.String()),
                profileImage: t.Optional(t.Files()),
                email: t.Optional(t.String()),
            }),
            detail: {
                tags: ["User"],
            }
        })
        .get("/:userId", UserCtrl.getUser, {
            params: t.Object({
                userId: t.Integer(),
            }),
            detail: {
                tags: ["User"],
            }
        })
        .get("/", UserCtrl.getAllUser, {
            query: t.Object({
                limit: t.Optional(t.String()),
                page: t.Optional(t.String()),
            }),
            detail: {
                tags: ["User"],
            }
        })
        .put("/:userId", UserCtrl.updateUser, {
            params: t.Object({
                userId: t.Integer(),
            }),
            body: t.Object({
                name: t.String(),
                telephone: t.String(),
                role: t.Optional(t.String()),
                profileImage: t.Optional(t.Files()),
                email: t.Optional(t.String())
            }),
            detail: {
                tags: ["User"],
            }
        })
        .delete("/:userId", UserCtrl.deleteUser, {
            params: t.Object({
                userId: t.Integer(),
            }),
            detail: {
                tags: ["User"],
            }
        });
}