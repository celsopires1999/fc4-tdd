import { NextFunction, Request, Response } from "express"
import { PropertyService } from "../../application/services/property_service"

export class PropertyController {
    constructor(private readonly propertyService: PropertyService) {}

    async createProperty(req: Request, res: Response): Promise<void> {
        try {
            const property = await this.propertyService.createProperty(req.body)
            res.status(201).json({
                message: "Property created successfully",
                property,
            })
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    }
}
