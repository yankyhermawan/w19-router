import { PrismaService } from "../prisma.service.js";
import { CategoriesException } from "./categoriesException.js";

export class CategoriesService {
	constructor() {
		this.prismaService = new PrismaService();
		this.categoriesException = new CategoriesException();
	}
	async findAll() {
		const response = this.prismaService.categories.findMany();
		return { status: 200, response: { message: response } };
	}

	async findOne(id) {
		const response = this.prismaService.categories.findUnique({
			where: {
				id: id,
			},
		});
		if (response) {
			return { status: 200, response: { message: response } };
		}
		return {
			status: 400,
			response: { message: this.categoriesException.itemNotFound() },
		};
	}

	async createCategories(data) {
		const response = this.prismaService.categories.create({
			data: {
				data,
			},
		});
		return { status: 200, response: { message: response } };
	}

	async patchCategories(id, data) {
		const response = this.prismaService.categories.findUnique({
			where: {
				id: id,
			},
		});
		if (!response) {
			return {
				status: 400,
				response: { message: this.categoriesException.itemNotFound() },
			};
		}
		const newData = {
			id: response.id,
			name: data.name || response.name,
			description: data.description || response.description,
			usersID: response.usersID,
			isActive: data.isActive || response.isActive,
		};
		const newResponse = this.prismaService.categories.update({
			where: {
				id: id,
			},
			data: newData,
		});
		return { status: 200, response: { message: newResponse } };
	}

	async deleteCategories(id) {
		const response = await this.prismaService.categories.delete({
			where: {
				id,
			},
		});
		return { status: 200, response: { message: response } };
	}
}
