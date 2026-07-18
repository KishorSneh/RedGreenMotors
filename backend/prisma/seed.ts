import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding RedGreenMotors database...');

  // --- Users ---
  const adminEmail = 'admin@redgreenmotors.com';
  if (!(await prisma.user.findUnique({ where: { email: adminEmail } }))) {
    await prisma.user.create({
      data: { name: 'Alex RedGreen (Admin)', email: adminEmail, passwordHash: await bcrypt.hash('admin123', 10), role: 'ADMIN' },
    });
    console.log('✅ Admin: admin@redgreenmotors.com / admin123');
  }

  const userEmail = 'client@redgreenmotors.com';
  if (!(await prisma.user.findUnique({ where: { email: userEmail } }))) {
    await prisma.user.create({
      data: { name: 'Jordan Enthusiast', email: userEmail, passwordHash: await bcrypt.hash('user123', 10), role: 'USER' },
    });
    console.log('✅ User: client@redgreenmotors.com / user123');
  }

  // --- Vehicles ---
  const vehicles = [
    // Coupes
    { make: 'Porsche', model: '911 GT3 RS', category: 'Coupe', price: 241300, quantity: 2 },
    { make: 'Chevrolet', model: 'Corvette Z06 3LZ', category: 'Coupe', price: 135400, quantity: 0 },
    { make: 'Lexus', model: 'LC 500', category: 'Coupe', price: 98600, quantity: 3 },
    { make: 'Nissan', model: 'GT-R Nismo', category: 'Coupe', price: 221990, quantity: 1 },

    // Sedans
    { make: 'BMW', model: 'M3 Competition xDrive', category: 'Sedan', price: 86200, quantity: 4 },
    { make: 'Audi', model: 'RS 6 Avant Performance', category: 'Sedan', price: 126600, quantity: 2 },
    { make: 'Mercedes-Benz', model: 'AMG C 63 S E', category: 'Sedan', price: 89000, quantity: 3 },
    { make: 'Tesla', model: 'Model S Plaid', category: 'Sedan', price: 89990, quantity: 5 },
    { make: 'Genesis', model: 'G70 3.3T Sport', category: 'Sedan', price: 52000, quantity: 4 },

    // SUVs
    { make: 'Mercedes-AMG', model: 'G 63 Biturbo', category: 'SUV', price: 183000, quantity: 1 },
    { make: 'Land Rover', model: 'Range Rover Sport SV', category: 'SUV', price: 181900, quantity: 2 },
    { make: 'BMW', model: 'X5 M Competition', category: 'SUV', price: 120400, quantity: 3 },
    { make: 'Porsche', model: 'Cayenne Turbo GT', category: 'SUV', price: 195600, quantity: 1 },
    { make: 'Lamborghini', model: 'Urus Performante', category: 'SUV', price: 264971, quantity: 1 },

    // Trucks
    { make: 'Ford', model: 'F-150 Raptor R', category: 'Truck', price: 111500, quantity: 3 },
    { make: 'Ram', model: '1500 TRX', category: 'Truck', price: 89900, quantity: 2 },
    { make: 'Rivian', model: 'R1T Adventure', category: 'Truck', price: 79900, quantity: 4 },
    { make: 'GMC', model: 'Hummer EV Edition 1', category: 'Truck', price: 112595, quantity: 0 },

    // Hatchbacks
    { make: 'Toyota', model: 'GR Corolla Circuit Edition', category: 'Hatchback', price: 45800, quantity: 5 },
    { make: 'Volkswagen', model: 'Golf R', category: 'Hatchback', price: 46190, quantity: 4 },
    { make: 'Honda', model: 'Civic Type R', category: 'Hatchback', price: 44895, quantity: 3 },
    { make: 'Hyundai', model: 'Ioniq 5 N', category: 'Hatchback', price: 66100, quantity: 2 },

    // Convertibles
    { make: 'Porsche', model: '718 Boxster GTS 4.0', category: 'Convertible', price: 97400, quantity: 2 },
    { make: 'Mazda', model: 'MX-5 Miata RF', category: 'Convertible', price: 38900, quantity: 6 },
    { make: 'BMW', model: 'M4 Cabriolet Competition', category: 'Convertible', price: 97800, quantity: 1 },

    // Wagons
    { make: 'Audi', model: 'RS 4 Avant', category: 'Wagon', price: 82900, quantity: 2 },
    { make: 'Volvo', model: 'V60 Polestar Engineered', category: 'Wagon', price: 72400, quantity: 3 },

    // Supercars
    { make: 'Ferrari', model: '296 GTB Assetto Fiorano', category: 'Supercar', price: 375000, quantity: 1 },
    { make: 'McLaren', model: '750S', category: 'Supercar', price: 339000, quantity: 1 },
    { make: 'Lamborghini', model: 'Revuelto', category: 'Supercar', price: 608358, quantity: 0 },
  ];

  let added = 0;
  for (const v of vehicles) {
    const exists = await prisma.vehicle.findFirst({ where: { make: v.make, model: v.model } });
    if (!exists) {
      await prisma.vehicle.create({ data: v });
      console.log(`  ✨ ${v.make} ${v.model}`);
      added++;
    }
  }

  const total = await prisma.vehicle.count();
  console.log(`\n✅ Added ${added} new vehicles. Total inventory: ${total} vehicles.`);
}

main()
  .catch((e) => { console.error('❌ Seed error:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
