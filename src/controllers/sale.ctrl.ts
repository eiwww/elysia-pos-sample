import db from "../database/database";

export const SaleCtrl = {
    getAllSales: async (ctx: any) => {
        const query = ctx.query;
        const limit = query.limit ? parseInt(query.limit) : 10;
		const page = query.page ? parseInt(query.page) : 1;
		const skip = (page - 1) * limit;
        const sales = await db.sale.findMany({
            take: limit,
			skip: skip,
            where: {
                deletedAt: null // Ensure sales are not deleted
            },
            select: {
                id: true,
                paid: true,
                total: true,
                saleItems: {
                    select: {
                        id: true,
                        quantity: true,
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true
                            }
                        },
                        price: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                customer: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                createdAt: true
            }
        });
        const countAllSales = await db.sale.count({
            where: {
                deletedAt: null // Ensure sales are not deleted
            }
        });
        return {
            message: "Fetch all sales",
            data: sales,
            pagination: {
                totalRecords: countAllSales,
				limit: limit,
				page: page,
				totalPages: Math.ceil(countAllSales / limit),
            }
        };
    },
    getSale: async (ctx: any) => {
        const sale = await db.sale.findUnique({
            where: {
                id: ctx.params.saleId,
                deletedAt: null // Ensure sale is not deleted
            },
            select: {
                id: true,
                paid: true,
                total: true,
                saleItems: {
                    select: {
                        id: true,
                        quantity: true,
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true
                            }
                        },
                        price: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                customer: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                createdAt: true
            }
        });
        return {
            message: "Sale found",
            data: sale
        };
    },
    createSale: async (ctx: any) => {
        const body = ctx.body;
        const loginUser = ctx.loginUser; // Assuming user ID is available in context
        // Create sale
        const sale = await db.sale.create({
            data: {
                total: body.total,
                paid: body.paid,
                userId: loginUser.userId,
                customerId: body.customerId || null,
                saleItems: {
                    create: body.items.map((item: any) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            }
        });

        // Update product stock
        for (const item of body.items) {
            await db.product.update({
                where: { id: item.productId },
                data: { stock: { decrement: item.quantity } }
            });
        }

        return {
            message: "Sale created",
            data: sale
        };
    }
}