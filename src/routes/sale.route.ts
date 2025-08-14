import { Elysia, t } from "elysia";
import { SaleCtrl } from "../controllers/sale.ctrl";
import { auth } from "../middlewares/auth.middleware";

export function SaleRoute(app: Elysia) {
	return app
        .post("/", SaleCtrl.createSale, {
            body: t.Object({
                total: t.Number(),
                paid: t.Integer(),
                customerId: t.Optional(t.Integer()),
                items: t.Array(
                    t.Object({
                        productId: t.Integer(),
                        quantity: t.Number(),
                        price: t.Number()
                    })
                )
            }),
            beforeHandle: auth.IsAuthorized,
            headers: t.Object({
                authorization: t.String()
            }),
            detail: {
                tags: ["Sale"]
            }
        })
        .get("/:saleId", SaleCtrl.getSale, {
            params: t.Object({
                saleId: t.Integer()
            }),
            beforeHandle: auth.IsAuthorized,
            headers: t.Object({
                authorization: t.String()
            }),
            detail: {
                tags: ["Sale"]
            }
        })
        .get("/", SaleCtrl.getAllSales, {
            query: t.Object({
                limit: t.Optional(t.String()),
                page: t.Optional(t.String())
            }),
            beforeHandle: auth.IsAuthorized,
            headers: t.Object({
                authorization: t.String()
            }),
            detail: {
                tags: ["Sale"]
            }
        });
}