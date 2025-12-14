import express from "express"
import request from "supertest"
import { DataSource } from "typeorm"
import { TypeORMUserRepository } from "../repositories/typeorm_user_repository"
import { UserService } from "../../application/services/user_service"
import { UserEntity } from "../persistence/entities/user_entity"
import { UserController } from "./user_controller"

const app = express()
app.use(express.json())

let dataSource: DataSource
let userRepository: TypeORMUserRepository
let userService: UserService
let userController: UserController

beforeAll(async () => {
    dataSource = new DataSource({
        type: "sqlite",
        database: ":memory:",
        dropSchema: true,
        entities: [UserEntity],
        synchronize: true,
        logging: false,
    })

    await dataSource.initialize()

    userRepository = new TypeORMUserRepository(
        dataSource.getRepository(UserEntity)
    )
    userService = new UserService(userRepository)
    userController = new UserController(userService)

    app.post("/users", (req, res, next) => {
        userController.createUser(req, res).catch((err) => next(err))
    })

    app.get("/users/:id", (req, res, next) => {
        userController.findUserById(req, res).catch((err) => next(err))
    })
})

afterAll(async () => {
    await dataSource.destroy()
})

describe("UserController (e2e)", () => {
    beforeEach(async () => {
        const userRepo = dataSource.getRepository(UserEntity)
        await userRepo.clear()
    })

    it("deve criar um usuário com sucesso", async () => {
        const response = await request(app).post("/users").send({
            name: "Test User",
        })

        expect(response.status).toBe(201)
        expect(response.body.message).toBe("User created successfully")
        expect(response.body.user).toHaveProperty("id")
        expect(response.body.user).toHaveProperty("name")
        expect(response.body.user.name).toBe("Test User")
    })

    it("deve retornar erro com código 400 e mensagem 'O campo nome é obrigatório.' ao enviar um nome vazio", async () => {
        const response = await request(app).post("/users").send({
            name: "",
        })

        expect(response.status).toBe(400)
        expect(response.body.message).toBe("O campo nome é obrigatório.")
    })

    it("deve encontrar um usuário pelo ID", async () => {
        const createUserResponse = await request(app).post("/users").send({
            name: "Find Me User",
        })

        const userId = createUserResponse.body.user.id
        const response = await request(app).get(`/users/${userId}`)

        expect(response.status).toBe(200)
        expect(response.body.id).toBe(userId)
        expect(response.body.name).toBe("Find Me User")
    })

    it("deve retornar 404 ao procurar um usuário que não existe", async () => {
        const response = await request(app).get(`/users/non-existent-id`)
        expect(response.status).toBe(404)
        expect(response.body.message).toBe("User not found.")
    })
})
