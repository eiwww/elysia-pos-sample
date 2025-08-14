import { NotFoundError } from "elysia";
import db from "../database/database";

export const CategoryCtrl = {
    getAllCategories: async (ctx: any) => {
        const query = ctx.query;
        const limit = query.limit ? parseInt(query.limit) : 10;
		const page = query.page ? parseInt(query.page) : 1;
		const skip = (page - 1) * limit;
        const categories = await db.category.findMany({
            take: limit,
			skip: skip,
            where: {
                deletedAt: null // Ensure categories are not deleted
            }
        });
        const countAllCategories = await db.category.count({
            where: {
                deletedAt: null // Ensure categories are not deleted
            }
        });
        return {
            message: "Fetch all categories",
            data: categories,
            pagination: {
                totalRecords: countAllCategories,
                limit: limit,
                page: page,
                totalPages: Math.ceil(countAllCategories / limit),
            }
        };
    },

    getCategory: async (ctx: any) => {
        const category = await db.category.findUnique({
            where: {
                id: ctx.params.categoryId,
                deletedAt: null // Ensure the category is not deleted
            }
        });
        return {
            message: "Category found",
            data: category
        };
    },

    createCategory: async (ctx: any) => {
        const body = ctx.body;
        const category = await db.category.create({
            data: {
                name: body.name
            }
        });
        return {
            message: "Category created successfully",
            data: category
        };
    },

    updateCategory: async (ctx: any) => {
        const body = ctx.body;
        const params = ctx.params;
        const categoryData = await db.category.findUnique({
            where: {
                id: params.categoryId,
                deletedAt: null // Ensure the category is not deleted
            }
        });
        if (!categoryData) {
            throw new NotFoundError("Category not found");
        }
        const updatedCategory = await db.category.update({
            where: {
                id: params.categoryId,
                deletedAt: null // Ensure the category is not deleted
            },
            data: {
                name: body.name
            }
        });
        return {
            message: "Category updated successfully",
            data: updatedCategory
        };
    },

    deleteCategory: async (ctx: any) => {
        const params = ctx.params;
        const categoryData = await db.category.findUnique({
            where: {
                id: params.categoryId,
                deletedAt: null // Ensure the category is not deleted
            }
        });
        if (!categoryData) {
            throw new NotFoundError("Category not found");
        }
        const category = await db.category.update({
            where: {
                id: params.categoryId
            },
            data: {
                deletedAt: new Date() // Soft delete
            }
        });
        return { 
            message: "Category deleted",
            data: category
        };
    }
}