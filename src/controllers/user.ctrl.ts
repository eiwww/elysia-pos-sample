import db from '../database/database';
import { Context, NotFoundError } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import { AuthenticationError } from '../exceptions/AuthenticationError';
import { InvariantError } from '../exceptions/InvariantError';

type JWTInstance = Awaited<ReturnType<typeof jwt>>

export const UserCtrl = {
	login: async ({ body, set, auth }: { body: any; set: Context['set']; auth: JWTInstance }) => {
		const { username, password } = body;
		if(!username || !password) {
			throw new InvariantError('Username and password are required');
		}
		const user = await db.user.findUnique({
			where: {
				username,
				deletedAt: null // Ensure the user is not deleted 
			}
		});
		const verifyPassword = await Bun.password.verify(
			password,
			user?.password || '',
			'bcrypt'
		);
		if (!verifyPassword){
			throw new AuthenticationError("Invalid credentials");
		}
		const token = await auth.sign({ 
			id: user?.id,
			name: user?.name,
			telephone: user?.telephone,
			role: user?.role,
			profileImageUrl: user?.profileImageUrl,
			email: user?.email,
		});
		return { 
			message: 'Login successful',
			user: {
				id: user?.id,
				name: user?.name,
				telephone: user?.telephone,
				role: user?.role,
				profileImageUrl: user?.profileImageUrl,
				email: user?.email,
			},
			token 
		};
	},
	getCurrentUser: async (ctx: any) => {
		if (!ctx.loginUser) {
			throw new AuthenticationError("Unauthorized");
		}
		return { message: 'Current user', data: ctx.loginUser };
	},
	createUser: async (ctx: any) => {
		const body = ctx.body;
		const password = await Bun.password.hash(
			body.password,
			{
				algorithm: 'bcrypt'
			}
		);
		let fileName = null;
		const profileImage = body.profileImage as File[];
		console.log(profileImage);
		if (profileImage != null && profileImage.length > 0) {
			const ext = "." + profileImage[0].name.split(".")[1];
			const uuid = crypto.randomUUID();
			fileName = uuid + ext;
			await Bun.write('images/' + fileName, profileImage[0]);
		}
		const user = await db.user.create({
			data: {
				username: body.username,
				password: password,
				name: body.name,
				telephone: body.telephone,
				role: body.role || 'cashier', // Default role is 'cashier'
				profileImageUrl: fileName,
				email: body.email,
			}
		})
		return {
			message: "User created",
			data: user
		}
	},
	getUser: async (ctx: any) => {
		const user = await db.user.findUnique({
			where: {
				id: ctx.params.userId,
				deletedAt: null // Ensure the user is not deleted
			}
		});
		return {
			message: "User found",
			data: user
		}
	},
	getAllUser: async (ctx: any) => {
		const query = ctx.query;
		const limit = query.limit ? parseInt(query.limit) : 10;
		const page = query.page ? parseInt(query.page) : 1;
		const skip = (page - 1) * limit;
		const users = await db.user.findMany({
			take: limit,
			skip: skip,
			where: {
				deletedAt: null // Ensure users are not deleted
			}
		});
		const countAllUser = await db.user.count({
			where: {
				deletedAt: null // Ensure users are not deleted
			}
		});
		return {
			message: "Fetch all users",
			data: users,
			pagination: {
				totalRecords: countAllUser,
				limit: limit,
				page: page,
				totalPages: Math.ceil(countAllUser / limit),
			}
		}
	},
	updateUser: async (ctx: any) => {
		const body = ctx.body;
		const params = ctx.params;
		const userData = await db.user.findUnique({
			where: {
				id: params.userId,
				deletedAt: null // Ensure the user is not deleted
			}
		});
		if (!userData) {
			throw new NotFoundError("User not found");
		}
		let fileName = userData.profileImageUrl;
		const profileImage = body.profileImage as File[];
		if (profileImage != null && profileImage.length > 0) {
			const ext = "." + profileImage[0].name.split(".")[1];
			const uuid = crypto.randomUUID();
			fileName = uuid + ext;
			await Bun.write('images/' + fileName, profileImage[0]);
		}
		const user = await db.user.update({
			where: {
				id: params.userId
			},
			data: {
				telephone: body.telephone,
				profileImageUrl: fileName,
				name: body.name,
				role: body.role || 'cashier', // Default role is 'cashier'
				email: body.email
			}
		})
		return {
			message: "User updated",
			data: user
		}
	},
	deleteUser: async (ctx: any) => {
		const params = ctx.params;
		const userData = await db.user.findUnique({
			where: {
				id: params.userId,
				deletedAt: null // Ensure the user is not deleted
			}
		});
		if (!userData) {
			throw new NotFoundError("User not found");
		}
		let fileName = userData.profileImageUrl;
		const user = await db.user.update({
			where: {
				id: params.userId
			},
			data: {
				deletedAt: new Date() // Soft delete
			}
		})
		const image = Bun.file('images/' + fileName);
		image.delete();
		return {
			message: "User deleted",
			data: user
		}
	}
}