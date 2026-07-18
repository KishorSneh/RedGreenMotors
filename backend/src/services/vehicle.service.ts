import { vehicleRepository } from '../repositories/vehicle.repository';

export const vehicleService = {
  async getAllVehicles() {
    return vehicleRepository.findAll();
  },

  async searchVehicles(query: {
    make?: string;
    model?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
  }) {
    const minPrice = query.minPrice ? Number(query.minPrice) : undefined;
    const maxPrice = query.maxPrice ? Number(query.maxPrice) : undefined;
    return vehicleRepository.search({
      make: query.make,
      model: query.model,
      category: query.category,
      minPrice: !isNaN(Number(minPrice)) ? minPrice : undefined,
      maxPrice: !isNaN(Number(maxPrice)) ? maxPrice : undefined,
    });
  },

  async getVehicleById(id: string) {
    const vehicle = await vehicleRepository.findById(id);
    if (!vehicle) {
      const err: any = new Error('Vehicle not found');
      err.status = 404;
      throw err;
    }
    return vehicle;
  },

  async createVehicle(data: { make?: string; model?: string; category?: string; price?: number | string; quantity?: number | string }) {
    if (!data.make || !data.model || !data.category || data.price === undefined || data.quantity === undefined) {
      const err: any = new Error('Missing required vehicle fields');
      err.status = 400;
      throw err;
    }
    return vehicleRepository.create({
      make: data.make,
      model: data.model,
      category: data.category,
      price: Number(data.price),
      quantity: Number(data.quantity),
    });
  },

  async updateVehicle(id: string, data: Partial<{ make: string; model: string; category: string; price: number | string; quantity: number | string }>) {
    await this.getVehicleById(id);
    const updateData: any = { ...data };
    if (data.price !== undefined) updateData.price = Number(data.price);
    if (data.quantity !== undefined) updateData.quantity = Number(data.quantity);
    return vehicleRepository.update(id, updateData);
  },

  async deleteVehicle(id: string) {
    await this.getVehicleById(id);
    await vehicleRepository.delete(id);
  },

  async purchaseVehicle(id: string) {
    const vehicle = await this.getVehicleById(id);
    if (vehicle.quantity <= 0) {
      const err: any = new Error('Vehicle is out of stock');
      err.status = 409;
      throw err;
    }
    return vehicleRepository.update(id, { quantity: vehicle.quantity - 1 });
  },

  async restockVehicle(id: string, amount: number | string) {
    const vehicle = await this.getVehicleById(id);
    const addAmount = Number(amount) || 1;
    return vehicleRepository.update(id, { quantity: vehicle.quantity + addAmount });
  },
};
