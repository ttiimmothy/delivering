import { db } from './client';
import { 
  users, 
  addresses, 
  restaurants, 
  menuCategories, 
  menuItems, 
  menuItemOptions, 
  menuItemOptionValues,
  courierProfiles,
  coupons
} from './schema';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('🌱 Starting database seed...');

  try {
    // Clear existing data (in reverse order of dependencies)
    console.log('🧹 Clearing existing data...');
    await db.delete(menuItemOptionValues);
    await db.delete(menuItemOptions);
    await db.delete(menuItems);
    await db.delete(menuCategories);
    await db.delete(courierProfiles);
    await db.delete(addresses);
    await db.delete(restaurants);
    await db.delete(users);
    await db.delete(coupons);

    // Create demo users
    console.log('👥 Creating demo users...');
    const hashedPassword = await bcrypt.hash('password123', 10);

    const [alice, bob, charlie, admin] = await db.insert(users).values([
      {
        email: 'alice@example.com',
        password: hashedPassword,
        firstName: 'Alice',
        lastName: 'Johnson',
        phone: '+1234567890',
        role: 'customer',
        emailVerified: true,
      },
      {
        email: 'bob@example.com',
        password: hashedPassword,
        firstName: 'Bob',
        lastName: 'Smith',
        phone: '+1234567891',
        role: 'merchant',
        emailVerified: true,
      },
      {
        email: 'charlie@example.com',
        password: hashedPassword,
        firstName: 'Charlie',
        lastName: 'Brown',
        phone: '+1234567892',
        role: 'courier',
        emailVerified: true,
      },
      {
        email: 'admin@example.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        phone: '+1234567893',
        role: 'admin',
        emailVerified: true,
      },
    ]).returning();

    // Create addresses for users
    console.log('🏠 Creating addresses...');
    await db.insert(addresses).values([
      {
        userId: alice.id,
        label: 'Home',
        street: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94102',
        latitude: '37.7749',
        longitude: '-122.4194',
        isDefault: true,
      },
      {
        userId: alice.id,
        label: 'Work',
        street: '456 Market St',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        latitude: '37.7849',
        longitude: '-122.4094',
        isDefault: false,
      },
    ]);

    // Create courier profile
    console.log('🚴 Creating courier profile...');
    await db.insert(courierProfiles).values({
      userId: charlie.id,
      vehicleType: 'bike',
      isAvailable: true,
      currentLocation: { latitude: 37.7749, longitude: -122.4194 },
      rating: '4.8',
      reviewCount: 25,
      totalDeliveries: 150,
    });

    // Create restaurant addresses first
    console.log('📍 Creating restaurant addresses...');
    const [pizzaAddress, burgerAddress, sushiAddress] = await db.insert(addresses).values([
      {
        userId: bob.id,
        label: 'Pizza Palace Address',
        street: '789 Broadway',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94133',
        country: 'US',
        latitude: '37.7849',
        longitude: '-122.4094',
        isDefault: false,
      },
      {
        userId: bob.id,
        label: 'Burger Joint Address',
        street: '456 Market St',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        country: 'US',
        latitude: '37.7849',
        longitude: '-122.4094',
        isDefault: false,
      },
      {
        userId: bob.id,
        label: 'Sushi Spot Address',
        street: '321 Union St',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94133',
        country: 'US',
        latitude: '37.7849',
        longitude: '-122.4094',
        isDefault: false,
      },
    ]).returning();

    // Create restaurants
    console.log('🍕 Creating restaurants...');
    const [pizzaPalace, burgerJoint, sushiSpot] = await db.insert(restaurants).values([
      {
        ownerId: bob.id,
        name: 'Pizza Palace',
        slug: 'pizza-palace',
        description: 'Authentic Italian pizza made with fresh ingredients',
        cuisine: 'Italian',
        rating: '4.5',
        reviewCount: 120,
        deliveryTime: 25,
        deliveryFee: '2.99',
        minimumOrder: '15.00',
        isOpen: true,
        addressId: pizzaAddress.id,
        phone: '+1234567894',
      },
      {
        ownerId: bob.id,
        name: 'Burger Joint',
        slug: 'burger-joint',
        description: 'Gourmet burgers with locally sourced beef',
        cuisine: 'American',
        rating: '4.3',
        reviewCount: 85,
        deliveryTime: 20,
        deliveryFee: '1.99',
        minimumOrder: '12.00',
        isOpen: true,
        addressId: burgerAddress.id,
        phone: '+1234567895',
      },
      {
        ownerId: bob.id,
        name: 'Sushi Spot',
        slug: 'sushi-spot',
        description: 'Fresh sushi and Japanese cuisine',
        cuisine: 'Japanese',
        rating: '4.7',
        reviewCount: 200,
        deliveryTime: 30,
        deliveryFee: '3.99',
        minimumOrder: '20.00',
        isOpen: true,
        addressId: sushiAddress.id,
        phone: '+1234567896',
      },
    ]).returning();

    // Create menu categories
    console.log('📋 Creating menu categories...');
    const [pizzaCategories, burgerCategories, sushiCategories] = await Promise.all([
      db.insert(menuCategories).values([
        { restaurantId: pizzaPalace.id, name: 'Pizzas', sortOrder: 1 },
        { restaurantId: pizzaPalace.id, name: 'Appetizers', sortOrder: 2 },
        { restaurantId: pizzaPalace.id, name: 'Drinks', sortOrder: 3 },
      ]).returning(),
      db.insert(menuCategories).values([
        { restaurantId: burgerJoint.id, name: 'Burgers', sortOrder: 1 },
        { restaurantId: burgerJoint.id, name: 'Sides', sortOrder: 2 },
        { restaurantId: burgerJoint.id, name: 'Drinks', sortOrder: 3 },
      ]).returning(),
      db.insert(menuCategories).values([
        { restaurantId: sushiSpot.id, name: 'Sushi Rolls', sortOrder: 1 },
        { restaurantId: sushiSpot.id, name: 'Nigiri', sortOrder: 2 },
        { restaurantId: sushiSpot.id, name: 'Sashimi', sortOrder: 3 },
        { restaurantId: sushiSpot.id, name: 'Appetizers', sortOrder: 4 },
      ]).returning(),
    ]);

    // Create menu items
    console.log('🍽️ Creating menu items...');
    const [pizzaItems, burgerItems, sushiItems] = await Promise.all([
      db.insert(menuItems).values([
        {
          restaurantId: pizzaPalace.id,
          categoryId: pizzaCategories[0].id,
          name: 'Margherita Pizza',
          description: 'Fresh mozzarella, tomato sauce, and basil',
          price: '16.99',
          isPopular: true,
          sortOrder: 1,
        },
        {
          restaurantId: pizzaPalace.id,
          categoryId: pizzaCategories[0].id,
          name: 'Pepperoni Pizza',
          description: 'Classic pepperoni with mozzarella cheese',
          price: '18.99',
          isPopular: true,
          sortOrder: 2,
        },
        {
          restaurantId: pizzaPalace.id,
          categoryId: pizzaCategories[1].id,
          name: 'Garlic Bread',
          description: 'Crispy bread with garlic butter',
          price: '6.99',
          sortOrder: 1,
        },
      ]).returning(),
      db.insert(menuItems).values([
        {
          restaurantId: burgerJoint.id,
          categoryId: burgerCategories[0].id,
          name: 'Classic Burger',
          description: 'Beef patty with lettuce, tomato, and onion',
          price: '12.99',
          isPopular: true,
          sortOrder: 1,
        },
        {
          restaurantId: burgerJoint.id,
          categoryId: burgerCategories[0].id,
          name: 'Cheeseburger',
          description: 'Classic burger with American cheese',
          price: '14.99',
          isPopular: true,
          sortOrder: 2,
        },
        {
          restaurantId: burgerJoint.id,
          categoryId: burgerCategories[1].id,
          name: 'French Fries',
          description: 'Crispy golden fries',
          price: '4.99',
          sortOrder: 1,
        },
      ]).returning(),
      db.insert(menuItems).values([
        {
          restaurantId: sushiSpot.id,
          categoryId: sushiCategories[0].id,
          name: 'California Roll',
          description: 'Crab, avocado, and cucumber',
          price: '8.99',
          isPopular: true,
          sortOrder: 1,
        },
        {
          restaurantId: sushiSpot.id,
          categoryId: sushiCategories[0].id,
          name: 'Spicy Tuna Roll',
          description: 'Fresh tuna with spicy mayo',
          price: '10.99',
          isPopular: true,
          sortOrder: 2,
        },
        {
          restaurantId: sushiSpot.id,
          categoryId: sushiCategories[1].id,
          name: 'Salmon Nigiri',
          description: 'Fresh salmon over sushi rice',
          price: '6.99',
          sortOrder: 1,
        },
      ]).returning(),
    ]);

    // Create menu item options
    console.log('⚙️ Creating menu item options...');
    const [pizzaSizeOption, burgerSizeOption] = await Promise.all([
      db.insert(menuItemOptions).values({
        menuItemId: pizzaItems[0].id,
        name: 'Size',
        type: 'single',
        isRequired: true,
        sortOrder: 1,
      }).returning(),
      db.insert(menuItemOptions).values({
        menuItemId: burgerItems[0].id,
        name: 'Size',
        type: 'single',
        isRequired: true,
        sortOrder: 1,
      }).returning(),
    ]);

    // Create menu item option values
    console.log('📝 Creating menu item option values...');
    await Promise.all([
      db.insert(menuItemOptionValues).values([
        { optionId: pizzaSizeOption[0].id, name: 'Small (10")', price: '0.00', isDefault: true, sortOrder: 1 },
        { optionId: pizzaSizeOption[0].id, name: 'Medium (12")', price: '3.00', sortOrder: 2 },
        { optionId: pizzaSizeOption[0].id, name: 'Large (14")', price: '6.00', sortOrder: 3 },
      ]),
      db.insert(menuItemOptionValues).values([
        { optionId: burgerSizeOption[0].id, name: 'Single Patty', price: '0.00', isDefault: true, sortOrder: 1 },
        { optionId: burgerSizeOption[0].id, name: 'Double Patty', price: '4.00', sortOrder: 2 },
      ]),
    ]);

    // Create demo coupons
    console.log('🎫 Creating demo coupons...');
    await db.insert(coupons).values([
      {
        code: 'WELCOME10',
        name: 'Welcome Discount',
        description: '10% off your first order',
        type: 'percentage',
        value: '10.00',
        minimumOrder: '20.00',
        maxUses: 1000,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
      {
        code: 'SAVE5',
        name: 'Fixed Discount',
        description: '$5 off orders over $25',
        type: 'fixed',
        value: '5.00',
        minimumOrder: '25.00',
        maxUses: 500,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
      },
    ]);

    console.log('✅ Database seeded successfully!');
    console.log('\n📋 Demo Credentials:');
    console.log('Customer: alice@example.com / password123');
    console.log('Merchant: bob@example.com / password123');
    console.log('Courier: charlie@example.com / password123');
    console.log('Admin: admin@example.com / password123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seed()
    .then(() => {
      console.log('🎉 Seed completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seed failed:', error);
      process.exit(1);
    });
}

export default seed;
