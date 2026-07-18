import { PrismaClient, Vehicle, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const vehicleRepository = {
  async findAll(): Promise<Vehicle[]> {
    return prisma.vehicle.findMany({ orderBy: { createdAt: 'desc' } });
  },

  async search(filters: {
    make?: string;
    model?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Vehicle[]> {
    const where: Prisma.VehicleWhereInput = {};

    if (filters.make) {
      where.make = { contains: filters.make };
    }
    if (filters.model) {
      where.model = { contains: filters.model };
    }
    if (filters.category) {
      where.category = { equals: filters.category };
    }
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) where.price.gte = filters.minPrice;
      if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice;
    }

    return prisma.vehicle.findMany({ where, orderBy: { price: 'asc' } });
  },

  async findById(id: string): Promise<Vehicle | null> {
    return prisma.vehicle.findUnique({ where: { id } });
  },

  async create(data: { make: string; model: string; category: string; price: number; quantity: number }): Promise<Vehicle> {
    return prisma.vehicle.create({ data });
  },

  async update(id: string, data: Partial<{ make: string; model: string; category: string; price: number; quantity: number }>): Promise<Vehicle> {
    return prisma.vehicle.update({ where: { id }, data });
  },

  async delete(id: string): Promise<void> {
    await prisma.vehicle.delete({ where: { id } });
  },
};
