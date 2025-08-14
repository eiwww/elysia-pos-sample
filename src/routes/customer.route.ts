import { Elysia, t } from "elysia";
import { CustomerCtrl } from "../controllers/customer.ctrl";
import { auth } from "../middlewares/auth.middleware";

export function CustomerRoute(app: Elysia) {
    return app
        .post("/", CustomerCtrl.createCustomer, {
            body: t.Object({
                name: t.String(),
                email: t.String(),
                phone: t.String()
            }),
            beforeHandle: auth.IsAuthorized,
            headers: t.Object({
                authorization: t.String()
            }),
            detail: {
                tags: ["Customer"]
            }
        })
        .get("/:customerId", CustomerCtrl.getCustomer, {
            params: t.Object({
                customerId: t.Integer()
            }),
            beforeHandle: auth.IsAuthorized,
            headers: t.Object({
                authorization: t.String()
            }),
            detail: {
                tags: ["Customer"]
            }
        })
        .get("/", CustomerCtrl.getAllCustomers, {
            query: t.Object({
                limit: t.Optional(t.String()),
                page: t.Optional(t.String())
            }),
            beforeHandle: auth.IsAuthorized,
            headers: t.Object({
                authorization: t.String()
            }),
            detail: {
                tags: ["Customer"]
            }
        })
        .put("/:customerId", CustomerCtrl.updateCustomer, {
            params: t.Object({
                customerId: t.Integer()
            }),
            body: t.Object({
                name: t.String(),
                email: t.String(),
                phone: t.String()
            }),
            beforeHandle: auth.IsAuthorized,
            headers: t.Object({
                authorization: t.String()
            }),
            detail: {
                tags: ["Customer"]
            }
        });
}