import express from "express"
import { DataSource } from "typeorm"
import { BookingService } from "./application/services/booking_service"
import { PropertyService } from "./application/services/property_service"
import { UserService } from "./application/services/user_service"
import { BookingEntity } from "./infrastructure/persistence/entities/booking_entity"
import { PropertyEntity } from "./infrastructure/persistence/entities/property_entity"
import { UserEntity } from "./infrastructure/persistence/entities/user_entity"
import { TypeORMBookingRepository } from "./infrastructure/repositories/typeorm_booking_repository"
import { TypeORMPropertyRepository } from "./infrastructure/repositories/typeorm_property_repository"
import { TypeORMUserRepository } from "./infrastructure/repositories/typeorm_user_repository"
import { BookingController } from "./infrastructure/web/booking_controller"
import { PropertyController } from "./infrastructure/web/property_controller"
import { UserController } from "./infrastructure/web/user_controller"

async function main() {
    const app = express()
    const PORT = process.env.PORT || 3000

    const dataSource = new DataSource({
        type: "sqlite",
        database: ":memory:",
        dropSchema: true,
        entities: [BookingEntity, PropertyEntity, UserEntity],
        synchronize: true,
        logging: false,
    })

    await dataSource.initialize()
    console.log("Data Source has been initialized!")

    const bookingRepository = new TypeORMBookingRepository(
        dataSource.getRepository(BookingEntity)
    )
    const propertyRepository = new TypeORMPropertyRepository(
        dataSource.getRepository(PropertyEntity)
    )
    const userRepository = new TypeORMUserRepository(
        dataSource.getRepository(UserEntity)
    )

    const propertyService = new PropertyService(propertyRepository)
    const userService = new UserService(userRepository)
    const bookingService = new BookingService(
        bookingRepository,
        propertyService,
        userService
    )

    const bookingController = new BookingController(bookingService)
    const propertyController = new PropertyController(propertyService)
    const userController = new UserController(userService)

    app.use(express.json())

    app.get("/api/hello", (req, res) => {
        res.json({ message: "Hello from API!" })
    })

    app.post("/bookings", (req, res, next) => {
        bookingController.createBooking(req, res).catch((err) => next(err))
    })

    app.post("/bookings/:id/cancel", (req, res, next) => {
        bookingController.cancelBooking(req, res).catch((err) => next(err))
    })

    app.post("/properties", (req, res, next) => {
        propertyController.createProperty(req, res).catch((err) => next(err))
    })

    app.post("/users", (req, res, next) => {
        userController.createUser(req, res).catch((err) => next(err))
    })

    app.get("/users/:id", (req, res, next) => {
        userController.findUserById(req, res).catch((err) => next(err))
    })

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`)
    })

    return app
}

main().catch((error) =>
    console.error("Error during application startup", error)
)
