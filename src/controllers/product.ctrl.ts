import { NotFoundError } from 'elysia';
import db from '../database/database';

export const ProductCtrl = {
	getAllProduct: async (ctx: any) => {
		const query = ctx.query;
		const limit = query.limit ? parseInt(query.limit) : 10;
		const page = query.page ? parseInt(query.page) : 1;
		const skip = (page - 1) * limit;
		const products = await db.product.findMany({
			take: limit,
			skip: skip,
			where: {
				deletedAt: null // Ensure products are not deleted
			},
			select: {
				id: true,
				name: true,
				price: true,
				description: true,
				imageUrl: true,
				stock: true,
				categoryId: true,
				createdAt: true,
				category: {
					select: {
						id: true,
						name: true
					}
				}
			}
		});
		const countAllProduct = await db.product.count({
			where: {
				deletedAt: null // Ensure products are not deleted
			}
		});
		return {
			message: "Fetch all products",
			data: products,
			pagination: {
				totalRecords: countAllProduct,
				limit: limit,
				page: page,
				totalPages: Math.ceil(countAllProduct / limit),
			}
		}
	},
	getProduct: async (ctx: any) => {
		const product = await db.product.findUnique({
			where: {
				id: ctx.params.productId,
				deletedAt: null // Ensure the product is not deleted
			},
			select: {
				id: true,
				name: true,
				price: true,
				description: true,
				imageUrl: true,
				stock: true,
				categoryId: true,
				createdAt: true,
				category: {
					select: {
						id: true,
						name: true
					}
				}
			}
		});
		return {
			message: "Product found",
			data: product
		}
	},
	createProduct: async (ctx: any) => {
		const body = ctx.body;
		let fileName = null;
		const image = body.image as File[];
		if (image != null && image.length > 0) {
			const ext = "." + image[0].name.split(".")[1];
			const uuid = crypto.randomUUID();
			fileName = uuid + ext;
			await Bun.write('images/' + fileName, image[0]);
		}
		const product = await db.product.create({
			data: {
				name: body.name,
				price: parseFloat(body.price) || 0,
				description: body.description,
				imageUrl: fileName,
				stock: parseInt(body.stock) || 0,
				categoryId: parseInt(body.categoryId) || null
			}
		});
		return {
			message: "Product created",
			data: product
		}
	},
	updateProduct: async (ctx: any) => {
		const body = ctx.body;
		const params = ctx.params;
		const productData = await db.product.findUnique({
			where: {
				id: params.productId,
				deletedAt: null // Ensure the product is not deleted
			}
		});
		if (!productData) {
			throw new NotFoundError("Product not found");
		}
		let fileName = productData?.imageUrl;
		const image = body.image as File[];
		if (image != null && image.length > 0) {
			const deleteImage = Bun.file('images/' + fileName);
			deleteImage.delete();
			const ext = "." + image[0].name.split(".")[1];
			const uuid = crypto.randomUUID();
			fileName = uuid + ext;
			await Bun.write('images/' + fileName, image[0]);
		}
		const product = await db.product.update({
			where: {
				id: params.productId
			},
			data: {
				name: body.name,
				price: parseFloat(body.price) || 0,
				description: body.description,
				imageUrl: fileName,
				stock: parseInt(body.stock) || 0,
				categoryId: parseInt(body.categoryId) || null
			}
		});
		return {
			message: "Product updated",
			data: product
		}
	},
	deleteProduct: async (ctx: any) => {
		const params = ctx.params;
		const productData = await db.product.findUnique({
			where: {
				id: params.productId,
				deletedAt: null // Ensure the product is not deleted
			}
		});
		if (!productData) {
			throw new NotFoundError("Product not found");
		}
		let fileName = productData?.imageUrl;
		const product = await db.product.update({
			where: {
				id: params.productId
			},
			data: {
				deletedAt: new Date() // Soft delete
			}
		});
		const image = Bun.file('images/' + fileName);
		image.delete();
		return {
			message: "Product deleted",
			data: product
		}
	}
}