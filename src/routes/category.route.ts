import { Elysia, t } from "elysia";
import { CategoryCtrl } from "../controllers/category.ctrl";
import { auth } from "../middlewares/auth.middleware";

export function CategoryRoute(app: Elysia) {
    return app
        .post("/", CategoryCtrl.createCategory, {
            body: t.Object({
                name: t.String()
            }),
            beforeHandle: auth.IsAuthorized,
            headers: t.Object({
                authorization: t.String()
            }),
            detail: {
                tags: ["Category"],
            }
        })
        .get("/:categoryId", CategoryCtrl.getCategory, {
            params: t.Object({
                categoryId  : t.Integer(),
            }),
            beforeHandle: auth.IsAuthorized,
            headers: t.Object({
                authorization: t.String()
            }),
            detail: {
                tags: ["Category"],
            }
        })
        .get("/", CategoryCtrl.getAllCategories, {
            query: t.Object({
                limit: t.Optional(t.String()),
                page: t.Optional(t.String()),
            }),
            beforeHandle: auth.IsAuthorized,
            headers: t.Object({
                authorization: t.String()
            }),
            detail: {
                tags: ["Category"],
            }
        })
        .put("/:categoryId", CategoryCtrl.updateCategory, {
            params: t.Object({
                categoryId: t.Integer(),
            }),
            beforeHandle: auth.IsAuthorized,
            headers: t.Object({
                authorization: t.String()
            }),
            body: t.Object({
                name: t.String()
            }),
            detail: {
                tags: ["Category"],
            }
        })
        .delete("/:categoryId", CategoryCtrl.deleteCategory, {
            params: t.Object({
                categoryId: t.Integer(),
            }),
            beforeHandle: auth.IsAuthorized,
            headers: t.Object({
                authorization: t.String()
            }),
            detail: {
                tags: ["Category"],
            }
        });
}