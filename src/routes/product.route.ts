import { Elysia, t } from "elysia";
import { ProductCtrl } from "../controllers/product.ctrl";
import { auth } from "../middlewares/auth.middleware";

export function ProductRoute(app: Elysia) {
    return app
        .post("/", ProductCtrl.createProduct, {
            body: t.Object({
                name: t.String(),
                price: t.String(),
                description: t.String(),
                image: t.Optional(t.Files()),
                stock: t.String(),
                categoryId: t.Optional(t.String())
            }),
            beforeHandle: auth.IsAuthorized,
            headers: t.Object({
                authorization: t.String()
            }),
            detail: {
                tags: ["Product"],
            }
        })
        .get("/:productId", ProductCtrl.getProduct, {
            params: t.Object({
                productId: t.Integer(),
            }),
            beforeHandle: auth.IsAuthorized,
            headers: t.Object({
                authorization: t.String()
            }),
            detail: {
                tags: ["Product"],
            }
        })
        .get("/", ProductCtrl.getAllProduct, {
            query: t.Object({
                limit: t.Optional(t.String()),
                page: t.Optional(t.String()),
            }),
            beforeHandle: auth.IsAuthorized,
            headers: t.Object({
                authorization: t.String()
            }),
            detail: {
                tags: ["Product"],
            }
        })
        .put("/:productId", ProductCtrl.updateProduct, {
            params: t.Object({
                productId: t.Integer(),
            }),
            beforeHandle: auth.IsAuthorized,
            headers: t.Object({
                authorization: t.String()
            }),
            body: t.Object({
                name: t.String(),
                price: t.String(),
                description: t.String(),
                image: t.Optional(t.Files()),
                stock: t.String(),
                categoryId: t.Optional(t.String())
            }),
            detail: {
                tags: ["Product"],
            }
        })
        .delete("/:productId", ProductCtrl.deleteProduct, {
            params: t.Object({
                productId: t.Integer(),
            }),
            beforeHandle: auth.IsAuthorized,
            headers: t.Object({
                authorization: t.String()
            }),
            detail: {
                tags: ["Product"],
            }
        });
}