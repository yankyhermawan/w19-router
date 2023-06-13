import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaService } from "../prisma.service.js";
import { UserException } from "./userException.js";

const jwt_key = process.env["JWT_PRIVATE"];

export class UsersService {
	constructor() {
		this.prismaService = new PrismaService();
		this.userException = new UserException();
	}

	async register(data) {
		const isExist = await this.prismaService.users.findUnique({
			where: { username: data.username },
		});
		if (!isExist) {
			const response = await this.prismaService.users.create({
				data: {
					username: data.username,
					password: bcrypt.hashSync(data.password, 10),
				},
			});
			response.password = undefined;
			return { status: 201, response: { message: response } };
		}
		return { status: 409, response: this.userException.userRegistered() };
	}

	async login(data) {
		const isExist = await this.prismaService.users.findUnique({
			where: {
				username: data.username,
			},
		});
		if (!isExist) {
			return {
				status: 404,
				response: { message: this.userException.userNotExist() },
			};
		}
		const result = bcrypt.compareSync(data.password, isExist.password);
		if (!result) {
			return {
				status: 404,
				response: { message: this.userException.invalidCredential() },
			};
		}

		isExist.password = undefined;
		return {
			status: 200,
			response: {
				acess_token: jwt.sign(isExist, jwt_key, { expiresIn: "24h" }),
			},
		};
	}
}
