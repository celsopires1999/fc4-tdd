import { Request, Response } from "express"
import { UserService } from "../../application/services/user_service"
import { CreateUserDTO } from "../../application/dtos/create_user_dto"

export class UserController {
    private userService: UserService

    constructor(userService: UserService) {
        this.userService = userService
    }

    async createUser(req: Request, res: Response): Promise<Response> {
        try {
            const { name } = req.body
            if (!name) {
                return res.status(400).json({
                    message: "O campo nome é obrigatório.",
                })
            }

            const dto: CreateUserDTO = { name }
            const user = await this.userService.createUser(dto)

            return res.status(201).json({
                message: "User created successfully",
                user: {
                    id: user.getId(),
                    name: user.getName(),
                },
            })
        } catch (error: any) {
            return res.status(400).json({
                message: error.message || "An unexpected error occurred",
            })
        }
    }

    async findUserById(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.params.id
            const user = await this.userService.findUserById(userId)

            if (!user) {
                return res.status(404).json({ message: "User not found." })
            }

            const userResponse = {
                id: user.getId(),
                name: user.getName(),
            }

            return res.status(200).json(userResponse)
        } catch (error: any) {
            return res.status(400).json({
                message: error.message || "An unexpected error occurred",
            })
        }
    }
}
