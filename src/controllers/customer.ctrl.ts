import { NotFoundError } from "elysia";
import db from "../database/database";

export const CustomerCtrl = {
    getAllCustomers: async (ctx: any) => {
        const query = ctx.query;
        const limit = query.limit ? parseInt(query.limit) : 10;
		const page = query.page ? parseInt(query.page) : 1;
		const skip = (page - 1) * limit;
        const customers = await db.customer.findMany({
            take: limit,
            skip: skip,
            where: {
                deletedAt: null // Ensure customers are not deleted
            }
        });
        const countAllCustomers = await db.customer.count({
            where: {
                deletedAt: null // Ensure customers are not deleted
            }
        });
        return {
            message: "Fetch all customers",
            data: customers,
            pagination: {
                totalRecords: countAllCustomers,
                limit: limit,
                page: page,
                totalPages: Math.ceil(countAllCustomers / limit),
            }
        };
    },

    getCustomer: async (ctx: any) => {
        const customer = await db.customer.findUnique({
            where: {
                id: ctx.params.customerId,
                deletedAt: null // Ensure the customer is not deleted
            }
        });
        return {
            message: "Customer found",
            data: customer
        };
    },

    createCustomer: async (ctx: any) => {
        const body = ctx.body;
        const customer = await db.customer.create({
            data: {
                name: body.name,
                email: body.email,
                phone: body.phone
            }
        });
        return {
            message: "Customer created",
            data: customer
        };
    },

    updateCustomer: async (ctx: any) => {
        const body = ctx.body;
        const params = ctx.params;
        const customerData = await db.customer.findUnique({
            where: {
                id: params.customerId,
                deletedAt: null // Ensure the customer is not deleted
            }
        });
        if (!customerData) {
            throw new NotFoundError("Customer not found");
        }
        const customer = await db.customer.update({
            where: { id: params.customerId },
            data: {
                name: body.name,
                email: body.email,
                phone: body.phone
            }
        });
        return {
            message: "Customer updated",
            data: customer
        };
    },

    deleteCustomer: async (ctx: any) => {
        const params = ctx.params;
        const customerData = await db.customer.findUnique({
            where: {
                id: params.customerId,
                deletedAt: null // Ensure the customer is not deleted
            }
        });
        if (!customerData) {
            throw new NotFoundError("Customer not found");
        }
        const customer = await db.customer.update({
            where: {
                id: params.customerId
            },
            data: {
                deletedAt: new Date() // Soft delete
            }
        });
        return {
            message: "Customer deleted",
            data: customer
        };
    }
}