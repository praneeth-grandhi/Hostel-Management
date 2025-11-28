const STORAGE_PREFIX = 'hostelManagement:'

function save(key, value) {
  localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value, null, 2))
}

function load(key) {
  const v = localStorage.getItem(STORAGE_PREFIX + key)
  return v ? JSON.parse(v) : null
}

export function getOwners() {
  return load('owners') || []
}

export function getHostels() {
  return load('hostels') || []
}

/**
 * Seed demo data:
 * - 3 owners (owner_1, owner_2, owner_3)
 * - 2 hostels (hostel_1 owned by owner_1, hostel_2 owned by owner_2 & owner_3)
 *
 * Call seedInitialData() once (or with force=true to overwrite).
 */
export function seedInitialData(force = false) {
  const seeded = load('seeded')
  if (seeded && !force) return { status: 'skipped', reason: 'already seeded' }

  const owners = [
    {
      id: 'owner_1',
      role: 'owner',
      firstName: 'Rahul',
      lastName: 'Sharma',
      displayName: 'Rahul S.',
      bio: 'Hostel owner with 5 years experience',
      email: 'rahul.sharma@example.com',
      phone: '+919876543210',
      secondaryPhone: '',
      password: 'DemoPass123!',
      documents: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'owner_2',
      role: 'owner',
      firstName: 'Anita',
      lastName: 'Verma',
      displayName: 'Anita V.',
      bio: 'Manager / co-owner',
      email: 'anita.verma@example.com',
      phone: '+919812345678',
      secondaryPhone: '',
      password: 'DemoPass123!',
      documents: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'owner_3',
      role: 'owner',
      firstName: 'Karan',
      lastName: 'Patel',
      displayName: 'Karan P.',
      bio: 'Co-owner and operations',
      email: 'karan.patel@example.com',
      phone: '+919800112233',
      secondaryPhone: '',
      password: 'DemoPass123!',
      documents: [],
      createdAt: new Date().toISOString(),
    },
  ]

  const hostels = [
    {
      id: 'hostel_1',
      name: 'Green Valley Hostel',
      address: '12 MG Road, Cityville',
      phone: '+919876543210',
      type: 'hostel',
      rooms: 24,
      floors: 3,
      businessHours: '9:00 - 21:00',
      owners: ['owner_1'],
      documents: [],
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'hostel_2',
      name: 'Sunrise PG & Suites',
      address: '45 Park Street, Townsville',
      phone: '+919812345678',
      type: 'pg',
      rooms: 40,
      floors: 4,
      businessHours: '8:00 - 22:00',
      owners: ['owner_2', 'owner_3'],
      documents: [],
      status: 'active',
      createdAt: new Date().toISOString(),
    },
  ]

  save('owners', owners)
  save('hostels', hostels)
  save('seeded', { at: new Date().toISOString(), by: 'seedInitialData' })

  return { status: 'seeded', ownersCount: owners.length, hostelsCount: hostels.length }
}

export default seedInitialData