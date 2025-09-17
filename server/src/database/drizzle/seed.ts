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
    try {
      await db.delete(menuItemOptionValues);
      await db.delete(menuItemOptions);
      await db.delete(menuItems);
      await db.delete(menuCategories);
      await db.delete(courierProfiles);
      await db.delete(addresses);
      await db.delete(restaurants);
      await db.delete(users);
      await db.delete(coupons);
    } catch (error) {
      // Tables might not exist yet, that's okay
      console.log('ℹ️  Some tables may not exist yet, continuing...');
    }

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
    const [pizzaAddress, burgerAddress, sushiAddress, bellaVistaAddress, sushiZenAddress, burgerPalaceAddress, tacoFiestaAddress, curryHouseAddress, pizzaCornerAddress] = await db.insert(addresses).values([
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
      // New restaurant addresses
      {
        userId: bob.id,
        label: 'Bella Vista Italian Address',
        street: '123 Columbus Ave',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94133',
        country: 'US',
        latitude: '37.7989',
        longitude: '-122.4094',
        isDefault: false,
      },
      {
        userId: bob.id,
        label: 'Sushi Zen Address',
        street: '456 Geary St',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94102',
        country: 'US',
        latitude: '37.7879',
        longitude: '-122.4094',
        isDefault: false,
      },
      {
        userId: bob.id,
        label: 'Burger Palace Address',
        street: '789 Mission St',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94103',
        country: 'US',
        latitude: '37.7849',
        longitude: '-122.4094',
        isDefault: false,
      },
      {
        userId: bob.id,
        label: 'Taco Fiesta Address',
        street: '321 Castro St',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94114',
        country: 'US',
        latitude: '37.7619',
        longitude: '-122.4094',
        isDefault: false,
      },
      {
        userId: bob.id,
        label: 'Curry House Address',
        street: '654 Fillmore St',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94117',
        country: 'US',
        latitude: '37.7849',
        longitude: '-122.4294',
        isDefault: false,
      },
      {
        userId: bob.id,
        label: 'Pizza Corner Address',
        street: '987 Valencia St',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94110',
        country: 'US',
        latitude: '37.7599',
        longitude: '-122.4094',
        isDefault: false,
      },
    ]).returning();

    // Create restaurants
    console.log('🍕 Creating restaurants...');
    const [pizzaPalace, burgerJoint, sushiSpot, bellaVista, sushiZen, burgerPalace, tacoFiesta, curryHouse, pizzaCorner] = await db.insert(restaurants).values([
      {
        ownerId: bob.id,
        name: 'Pizza Palace',
        slug: 'pizza-palace',
        description: 'Authentic Italian pizza made with fresh ingredients',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500',
        cuisine: 'Italian',
        rating: '4.5',
        reviewCount: 120,
        deliveryTime: 25,
        deliveryFee: '2.99',
        minimumOrder: '15.00',
        isOpen: true,
        isActive: true,
        addressId: pizzaAddress.id,
        phone: '+1234567894',
      },
      {
        ownerId: bob.id,
        name: 'Burger Joint',
        slug: 'burger-joint',
        description: 'Gourmet burgers with locally sourced beef',
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500',
        cuisine: 'American',
        rating: '4.3',
        reviewCount: 85,
        deliveryTime: 20,
        deliveryFee: '1.99',
        minimumOrder: '12.00',
        isOpen: true,
        isActive: true,
        addressId: burgerAddress.id,
        phone: '+1234567895',
      },
      {
        ownerId: bob.id,
        name: 'Sushi Spot',
        slug: 'sushi-spot',
        description: 'Fresh sushi and Japanese cuisine',
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500',
        cuisine: 'Japanese',
        rating: '4.7',
        reviewCount: 200,
        deliveryTime: 30,
        deliveryFee: '3.99',
        minimumOrder: '20.00',
        isOpen: true,
        isActive: true,
        addressId: sushiAddress.id,
        phone: '+1234567896',
      },
      // New restaurants from the provided data
      {
        ownerId: bob.id,
        name: 'Bella Vista Italian',
        slug: 'bella-vista-italian',
        description: 'Authentic Italian cuisine with a modern twist',
        image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=500&h=300&fit=crop&crop=center',
        cuisine: 'Italian',
        rating: '4.8',
        reviewCount: 150,
        deliveryTime: 30, // 25-35 min average
        deliveryFee: '3.50',
        minimumOrder: '18.00',
        isOpen: true,
        isActive: true,
        addressId: bellaVistaAddress.id,
        phone: '+1234567897',
      },
      {
        ownerId: bob.id,
        name: 'Sushi Zen',
        slug: 'sushi-zen',
        description: 'Traditional Japanese sushi and sashimi',
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500&h=300&fit=crop&crop=center',
        cuisine: 'Japanese',
        rating: '4.9',
        reviewCount: 200,
        deliveryTime: 35, // 30-40 min average
        deliveryFee: '4.50',
        minimumOrder: '25.00',
        isOpen: true,
        isActive: true,
        addressId: sushiZenAddress.id,
        phone: '+1234567898',
      },
      {
        ownerId: bob.id,
        name: 'Burger Palace',
        slug: 'burger-palace',
        description: 'Classic American burgers with premium ingredients',
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&h=300&fit=crop&crop=center',
        cuisine: 'American',
        rating: '4.6',
        reviewCount: 100,
        deliveryTime: 25, // 20-30 min average
        deliveryFee: '2.50',
        minimumOrder: '12.00',
        isOpen: true,
        isActive: true,
        addressId: burgerPalaceAddress.id,
        phone: '+1234567899',
      },
      {
        ownerId: bob.id,
        name: 'Taco Fiesta',
        slug: 'taco-fiesta',
        description: 'Authentic Mexican tacos and burritos',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=300&fit=crop&crop=center',
        cuisine: 'Mexican',
        rating: '4.7',
        reviewCount: 80,
        deliveryTime: 20, // 15-25 min average
        deliveryFee: '1.99',
        minimumOrder: '10.00',
        isOpen: false, // Currently closed
        isActive: true,
        addressId: tacoFiestaAddress.id,
        phone: '+1234567900',
      },
      {
        ownerId: bob.id,
        name: 'Curry House',
        slug: 'curry-house',
        description: 'Authentic Indian curries and traditional dishes',
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&h=300&fit=crop&crop=center',
        cuisine: 'Indian',
        rating: '4.5',
        reviewCount: 120,
        deliveryTime: 40, // 35-45 min average
        deliveryFee: '3.99',
        minimumOrder: '15.00',
        isOpen: true,
        isActive: true,
        addressId: curryHouseAddress.id,
        phone: '+1234567901',
      },
      {
        ownerId: bob.id,
        name: 'Pizza Corner',
        slug: 'pizza-corner',
        description: 'New York style pizza with fresh toppings',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&h=300&fit=crop&crop=center',
        cuisine: 'Italian',
        rating: '4.4',
        reviewCount: 90,
        deliveryTime: 30, // 25-35 min average
        deliveryFee: '2.99',
        minimumOrder: '16.00',
        isOpen: true,
        isActive: true,
        addressId: pizzaCornerAddress.id,
        phone: '+1234567902',
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
