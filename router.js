import express from "express";
import { UsersService } from "./users/userService.js";
import { CategoriesService } from "./categories/categoriesService.js";

const port = process.env.PORT || 4000;
const app = express();
const userService = new UsersService();
const categoriesService = new CategoriesService();
app.use(express.json());

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
		const response = await categoriesService.findAll();
		res.status(response.status).json(response.response);
	})
	.post(async (req, res) => {
		const response = await categoriesService.createCategories(req.body);
		res.status(response.status).json(response.response);
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
