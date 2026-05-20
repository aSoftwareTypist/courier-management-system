import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ── System Setting ──────────────────────────────────────────────────────────
  await prisma.systemSetting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Courier CMS Ltd.',
      email: 'info@couriercms.com',
      contact: '+977-01-4000000',
      address: 'Thamel, Kathmandu, Nepal',
    },
  });
  console.log('✅ System settings seeded.');

  // ── Branches ────────────────────────────────────────────────────────────────
  const ktm = await prisma.branch.upsert({
    where: { branchCode: 'KTM-01' },
    update: {},
    create: {
      branchCode: 'KTM-01',
      street: '45 Thamel Marg',
      city: 'Kathmandu',
      state: 'Bagmati',
      zipCode: '44600',
      country: 'Nepal',
      contact: '+977-01-4100000',
      latitude: 27.7172,
      longitude: 85.3240,
    },
  });

  const pkr = await prisma.branch.upsert({
    where: { branchCode: 'PKR-01' },
    update: {},
    create: {
      branchCode: 'PKR-01',
      street: '12 Lakeside Road',
      city: 'Pokhara',
      state: 'Gandaki',
      zipCode: '33700',
      country: 'Nepal',
      contact: '+977-61-4200000',
      latitude: 28.2096,
      longitude: 83.9856,
    },
  });

  const brt = await prisma.branch.upsert({
    where: { branchCode: 'BRT-01' },
    update: {},
    create: {
      branchCode: 'BRT-01',
      street: '8 Main Chowk',
      city: 'Biratnagar',
      state: 'Koshi',
      zipCode: '56613',
      country: 'Nepal',
      contact: '+977-21-4300000',
      latitude: 26.4525,
      longitude: 87.2718,
    },
  });
  console.log('✅ Branches seeded.');

  // ── Admin User ──────────────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('password', 10);

  await prisma.user.upsert({
    where: { email: 'admin@cms.com' },
    update: {},
    create: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@cms.com',
      password: hashedPassword,
      role: 'ADMIN',
      branchId: ktm.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'staff@cms.com' },
    update: {},
    create: {
      firstName: 'Ram',
      lastName: 'Sharma',
      email: 'staff@cms.com',
      password: hashedPassword,
      role: 'STAFF',
      branchId: pkr.id,
    },
  });
  console.log('✅ Users seeded. (admin@cms.com / password)');

  // ── Sample Parcels ──────────────────────────────────────────────────────────
  const parcels = [
    {
      trackingNumber: 'CMS-SEED01-AAAA',
      senderName: 'Aarav Thapa',
      senderPhone: '9801000001',
      senderAddress: 'Thamel, Kathmandu',
      receiverName: 'Sita Rai',
      receiverPhone: '9801000002',
      receiverAddress: 'Lakeside, Pokhara',
      weight: 2.5,
      status: 'DELIVERED' as const,
      fromBranchId: ktm.id,
      toBranchId: pkr.id,
    },
    {
      trackingNumber: 'CMS-SEED02-BBBB',
      senderName: 'Bishal KC',
      senderPhone: '9801000003',
      senderAddress: 'New Road, Kathmandu',
      receiverName: 'Priya Limbu',
      receiverPhone: '9801000004',
      receiverAddress: 'Main Chowk, Biratnagar',
      weight: 1.2,
      status: 'IN_TRANSIT' as const,
      fromBranchId: ktm.id,
      toBranchId: brt.id,
    },
    {
      trackingNumber: 'CMS-SEED03-CCCC',
      senderName: 'Dipak Gurung',
      senderPhone: '9801000005',
      senderAddress: 'Lakeside, Pokhara',
      receiverName: 'Anita Shrestha',
      receiverPhone: '9801000006',
      receiverAddress: 'Thamel, Kathmandu',
      weight: 3.0,
      status: 'PENDING' as const,
      fromBranchId: pkr.id,
      toBranchId: ktm.id,
    },
  ];

  for (const p of parcels) {
    const parcel = await prisma.parcel.upsert({
      where: { trackingNumber: p.trackingNumber },
      update: {},
      create: p,
    });

    await prisma.parcelTrack.deleteMany({ where: { parcelId: parcel.id } });
    await prisma.parcelTrack.createMany({
      data: [
        { parcelId: parcel.id, status: 'PENDING', note: 'Parcel registered at origin branch' },
        ...(p.status === 'IN_TRANSIT' || p.status === 'DELIVERED'
          ? [{ parcelId: parcel.id, status: 'IN_TRANSIT' as const, note: 'Dispatched from origin', location: 'Kathmandu Hub' }]
          : []),
        ...(p.status === 'DELIVERED'
          ? [{ parcelId: parcel.id, status: 'DELIVERED' as const, note: 'Delivered to recipient', location: 'Pokhara' }]
          : []),
      ],
    });
  }
  console.log('✅ Sample parcels seeded.');

  // ── Sample Route ────────────────────────────────────────────────────────────
  await prisma.route.upsert({
    where: { id: 1 },
    update: {},
    create: {
      vehicleType: 'VAN',
      startLocation: 'Kathmandu',
      endLocation: 'Pokhara',
      status: 'ACTIVE',
    },
  });
  console.log('✅ Sample route seeded.');

  console.log('\n🎉 Database seeded successfully!');
  console.log('   Login: admin@cms.com / password');
}

main()
  .catch((e) => { console.error('Seed failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
