import { Request, Response, NextFunction } from 'express';
import { vehicleService } from '../services/vehicle.service';

export const getAllVehicles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const vehicles = await vehicleService.getAllVehicles();
    res.status(200).json(vehicles);
  } catch (error) {
    next(error);
  }
};

export const searchVehicles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const vehicles = await vehicleService.searchVehicles(req.query);
    res.status(200).json(vehicles);
  } catch (error) {
    next(error);
  }
};

export const getVehicleById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const vehicle = await vehicleService.getVehicleById(req.params.id);
    res.status(200).json(vehicle);
  } catch (error) {
    next(error);
  }
};

export const createVehicle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const vehicle = await vehicleService.createVehicle(req.body);
    res.status(201).json(vehicle);
  } catch (error) {
    next(error);
  }
};

export const updateVehicle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const vehicle = await vehicleService.updateVehicle(req.params.id, req.body);
    res.status(200).json(vehicle);
  } catch (error) {
    next(error);
  }
};

export const deleteVehicle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await vehicleService.deleteVehicle(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const purchaseVehicle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const vehicle = await vehicleService.purchaseVehicle(req.params.id);
    res.status(200).json(vehicle);
  } catch (error) {
    next(error);
  }
};

export const restockVehicle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const vehicle = await vehicleService.restockVehicle(req.params.id, req.body.amount);
    res.status(200).json(vehicle);
  } catch (error) {
    next(error);
  }
};
