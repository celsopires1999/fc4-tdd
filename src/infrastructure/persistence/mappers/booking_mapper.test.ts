import { Entity } from "typeorm"
import { Booking } from "../../../domain/entities/booking"
import { Property } from "../../../domain/entities/property"
import { User } from "../../../domain/entities/user"
import { DateRange } from "../../../domain/value_objects/date_range"
import { BookingEntity } from "../entities/booking_entity"
import { PropertyEntity } from "../entities/property_entity"
import { UserEntity } from "../entities/user_entity"
import { BookingMapper } from "./booking_mapper"
import { PropertyMapper } from "./property_mapper"

describe("BookingMapper", () => {
    let propertyEntity: PropertyEntity
    let guestEntity: UserEntity
    let bookingEntity: BookingEntity

    let propertyDomain: Property
    let guestDomain: User
    let bookingDomain: Booking

    beforeEach(() => {
        // Setup para Entidades de Persistência
        propertyEntity = new PropertyEntity()
        propertyEntity.id = "prop1"
        propertyEntity.name = "Casa na Montanha"
        propertyEntity.description = "Vista incrível"
        propertyEntity.maxGuests = 4
        propertyEntity.basePricePerNight = 300

        guestEntity = new UserEntity()
        guestEntity.id = "user1"
        guestEntity.name = "João Convidado"

        bookingEntity = new BookingEntity()
        bookingEntity.id = "booking1"
        bookingEntity.property = propertyEntity
        bookingEntity.guest = guestEntity
        bookingEntity.startDate = new Date("2024-10-10")
        bookingEntity.endDate = new Date("2024-10-15")
        bookingEntity.guestCount = 2
        bookingEntity.totalPrice = 1500
        bookingEntity.status = "CONFIRMED"

        // Setup para Objetos de Domínio
        propertyDomain = new Property(
            "prop1",
            "Casa na Montanha",
            "Vista incrível",
            4,
            300,
        )
        guestDomain = new User("user1", "João Convidado")
        const dateRange = new DateRange(
            new Date("2024-10-10"),
            new Date("2024-10-15"),
        )
        bookingDomain = new Booking(
            "booking1",
            propertyDomain,
            guestDomain,
            dateRange,
            2,
        )
        bookingDomain["totalPrice"] = 1500
        bookingDomain["status"] = "CONFIRMED"
    })

    it("deve converter BookingEntity em Booking corretamente", () => {
        const result = BookingMapper.toDomain(bookingEntity)

        expect(result).toBeInstanceOf(Booking)
        expect(result.getId()).toBe("booking1")
        expect(result.getGuestCount()).toBe(2)
        expect(result.getTotalPrice()).toBe(1500)
        expect(result.getStatus()).toBe("CONFIRMED")

        expect(result.getProperty()).toBeInstanceOf(Property)
        expect(result.getProperty().getId()).toBe("prop1")

        expect(result.getGuest()).toBeInstanceOf(User)
        expect(result.getGuest().getId()).toBe("user1")

        expect(result.getDateRange()).toBeInstanceOf(DateRange)
        expect(result.getDateRange().getStartDate()).toEqual(
            new Date("2024-10-10"),
        )
    })

    describe("deve lançar erro de validação ao faltar campos obrigatórios no BookingEntity", () => {
        const arrange = [
            {
                name: "propriedade ausente",
                data: {
                    id: "1",
                    hasProperty: false,
                    hasGuest: true,
                    startDate: new Date(),
                    endDate: new Date(),
                    guestCount: 1,
                    totalPrice: 100,
                    status: "PENDING",
                },
                expectedError: "A propriedade é obrigatória",
            },
            {
                name: "hóspede ausente",
                data: {
                    id: "1",
                    hasProperty: true,
                    hasGuest: false,
                    startDate: new Date(),
                    endDate: new Date(),
                    guestCount: 1,
                    totalPrice: 100,
                    status: "PENDING",
                },
                expectedError: "O hóspede é obrigatório",
            },
            {
                name: "data de início ausente",
                data: {
                    id: "1",
                    hasProperty: true,
                    hasGuest: true,
                    endDate: new Date(),
                    guestCount: 1,
                    totalPrice: 100,
                    status: "PENDING",
                },
                expectedError: "A data de início é obrigatória",
            },
            {
                name: "data de término ausente",
                data: {
                    id: "1",
                    hasProperty: true,
                    hasGuest: true,
                    startDate: new Date(),
                    guestCount: 1,
                    totalPrice: 100,
                    status: "PENDING",
                },
                expectedError: "A data de término é obrigatória",
            },
            {
                name: "contagem de hóspedes zero",
                data: {
                    id: "1",
                    hasProperty: true,
                    hasGuest: true,
                    startDate: new Date("2024-10-10"),
                    endDate: new Date("2024-10-15"),
                    guestCount: 0,
                    totalPrice: 100,
                    status: "PENDING",
                },
                expectedError: "O número de hóspedes deve ser maior que zero.",
            },
        ]

        test.each(arrange)("quando $name", ({ data, expectedError }) => {
            const {
                id,
                hasProperty,
                hasGuest,
                guestCount,
                status,
                totalPrice,
                startDate,
                endDate,
            } = data
            const entity = new BookingEntity()
            entity.id = id
            entity.endDate = endDate!
            entity.startDate = startDate!
            entity.guestCount = guestCount
            entity.status = status! as "CONFIRMED" | "CANCELLED"
            entity.totalPrice = totalPrice
            entity.property = hasProperty ? propertyEntity : undefined!
            entity.guest = hasGuest ? guestEntity : undefined!

            expect(() =>
                BookingMapper.toDomain(entity as BookingEntity),
            ).toThrow(expectedError)
        })
    })

    it("deve converter Booking para BookingEntity corretamente", () => {
        const result = BookingMapper.toPersistence(bookingDomain)

        expect(result).toBeInstanceOf(BookingEntity)
        expect(result.id).toBe("booking1")
        expect(result.guestCount).toBe(2)
        expect(result.totalPrice).toBe(1500)
        expect(result.status).toBe("CONFIRMED")
        expect(result.property.id).toBe("prop1")
        expect(result.guest.id).toBe("user1")
        expect(result.startDate).toEqual(new Date("2024-10-10"))
    })
})
