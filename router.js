import express from "express";
import { UsersService } from "./users/userService.js";
import { CategoriesService } from "./categories/categoriesService.js";
import cors from "cors";
import { CategoriesGuard } from "./categories/categoriesGuard.js";

const port = process.env.PORT || 4000;
const app = express();
const userService = new UsersService();
const categoriesService = new CategoriesService();
const categoriesGuard = new CategoriesGuard();

app.use(express.json());
app.use(cors());

app.route("/user/register").post(async (req, res) => {
	const response = await userService.register(req.body);
	res.status(response.status).json(response.response);
});

app.route("/user/login").post(async (req, res) => {
	const response = await userService.login(req.body);
	res.status(response.status).json(response.response);
});

app
	.route("/categories")
	.get(async (req, res) => {
		const token = String(
			req.headers["authorization"].split(" ")[1].replace("'", "")
		);
		const checkToken = categoriesGuard.checkTokenValid(token);
		if (checkToken) {
			const response = await categoriesService.findAll();
			res.status(response.status).json({ message: response.response });
		} else {
			res.status(401).json({ message: "Invalid Token" });
		}
	})
	.post(async (req, res) => {
		const token = String(
			req.headers["authorization"].split(" ")[1].replace("'", "")
		);
		const checkToken = categoriesGuard.checkTokenValid(token);
		if (checkToken) {
			req["user"] = checkToken;
			console.log(req.user);
			const response = await categoriesService.createCategories(
				req.body,
				checkToken.id
			);
			res.status(response.status).json(response.response);
		} else {
			res.status(401).json({ message: "Invalid Token" });
		}
	});

app
	.route("/categories/:id")
	.get(async (req, res) => {
		const id = req.params.id;
		const response = await categoriesService.findOne(+id);
		res.status(response.status).json(response.response);
	})
	.patch(async (req, res) => {
		const id = req.params.id;
		const response = await categoriesService.patchCategories(+id, req.body);
		res.status(response.status).json(response.response);
	})
	.delete(async (req, res) => {
		const id = req.params.id;
		const response = await categoriesService.deleteCategories(+id);
		res.status(response.status).json(response.response);
	});

app.listen(port, () => {
	console.log(`Listened to ${port}`);
});
