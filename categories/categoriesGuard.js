import jwt from "jsonwebtoken";

export class CategoriesGuard {
	checkTokenValid(token) {
		return jwt.verify(token, process.env["JWT_PRIVATE"]);
	}
}
