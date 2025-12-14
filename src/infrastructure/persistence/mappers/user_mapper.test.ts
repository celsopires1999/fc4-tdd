import { User } from "../../../domain/entities/user"
import { UserEntity } from "../entities/user_entity"
import { UserMapper } from "./user_mapper"

describe("UserMapper", () => {
    describe("toDomain", () => {
        it("deve mapear uma UserEntity para um User de domínio", () => {
            // Arrange
            const entity = new UserEntity()
            entity.id = "user-123"
            entity.name = "João da Silva"

            // Act
            const domain = UserMapper.toDomain(entity)

            // Assert
            expect(domain).toBeInstanceOf(User)
            expect(domain.getId()).toBe("user-123")
            expect(domain.getName()).toBe("João da Silva")
        })
    })

    describe("toPersistence", () => {
        it("deve mapear um User de domínio para uma UserEntity", () => {
            // Arrange
            const domain = new User("user-123", "João da Silva")

            // Act
            const entity = UserMapper.toPersistence(domain)

            // Assert
            expect(entity).toBeInstanceOf(UserEntity)
            expect(entity.id).toBe("user-123")
            expect(entity.name).toBe("João da Silva")
        })
    })
})
