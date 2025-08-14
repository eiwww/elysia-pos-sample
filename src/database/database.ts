import { PrismaClient } from "@prisma/client";

const db = new PrismaClient({
	log: ["query", "info", "warn", "error"],
});

db.$on("query", (e) => {
	console.log(`Query: ${e.query}`);
	console.log(`Params: ${e.params}`);
	console.log(`Duration: ${e.duration}ms`);
	console.log(`Operation Time: ${e.timestamp}`);
});

export default db;