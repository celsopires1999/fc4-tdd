import { Property } from "../../../domain/entities/property"
import { PropertyEntity } from "../entities/property_entity"
import { PropertyMapper } from "./property_mapper"

describe("PropertyMapper", () => {
    it("deve converter PropertyEntity em Property corretamente", () => {
        const entity = new PropertyEntity()
        entity.id = "1"
        entity.name = "Casa na Praia"
        entity.description = "Uma bela casa de frente para o mar."
        entity.maxGuests = 6
        entity.basePricePerNight = 500

        const domain = PropertyMapper.toDomain(entity)

        expect(domain).toBeInstanceOf(Property)
        expect(domain.getId()).toBe("1")
        expect(domain.getName()).toBe("Casa na Praia")
        expect(domain.getDescription()).toBe(
            "Uma bela casa de frente para o mar.",
        )
        expect(domain.getMaxGuests()).toBe(6)
        expect(domain.getBasePricePerNight()).toBe(500)
    })

    describe("deve lançar erro de validação ao faltar campos obrigatórios no PropertyEntity", () => {
        const arrange = [
            {
                name: "nome vazio",
                entity: {
                    id: "1",
                    name: "",
                    description: "desc",
                    maxGuests: 4,
                    basePricePerNight: 100,
                } as PropertyEntity,
                expectedError: "O nome da propriedade é obrigatório.",
            },
            {
                name: "maxGuests zero",
                entity: {
                    id: "1",
                    name: "Casa",
                    description: "desc",
                    maxGuests: 0,
                    basePricePerNight: 100,
                } as PropertyEntity,
                expectedError: "A capacidade máxima deve ser maior que zero.",
            },
            {
                name: "maxGuests negativo",
                entity: {
                    id: "1",
                    name: "Casa",
                    description: "desc",
                    maxGuests: -1,
                    basePricePerNight: 100,
                } as PropertyEntity,
                expectedError: "A capacidade máxima deve ser maior que zero.",
            },
        ]

        test.each(arrange)("quando $name", ({ entity, expectedError }) => {
            expect(() => PropertyMapper.toDomain(entity)).toThrow(expectedError)
        })
    })

    it("deve converter Property para PropertyEntity corretamente", () => {
        const domain = new Property(
            "1",
            "Casa na Praia",
            "Uma bela casa de frente para o mar.",
            6,
            500,
        )

        const entity = PropertyMapper.toPersistence(domain)

        expect(entity).toBeInstanceOf(PropertyEntity)
        expect(entity.id).toBe("1")
        expect(entity.name).toBe("Casa na Praia")
        expect(entity.description).toBe("Uma bela casa de frente para o mar.")
        expect(entity.maxGuests).toBe(6)
        expect(entity.basePricePerNight).toBe(500)
    })
})
