import { mutationField, nonNull, intArg, stringArg, booleanArg, arg } from 'nexus';
import { db } from '../database/drizzle/client';
import { 
  users, addresses, courierProfiles, restaurants, menuCategories, menuItems, menuItemOptions, menuItemOptionValues,
  carts, cartItems, orders, orderItems, orderEvents, deliveries, reviews, favorites
} from '../database/drizzle/schema';
import { eq, and, desc, asc, inArray } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { convertDateFields } from '../lib/dateHelpers';

// ===== AUTHENTICATION MUTATIONS =====
export const signup = mutationField('signup', {
  type: 'AuthResponse',
  args: {
    input: nonNull(arg({ type: 'SignupInput' })),
  },
  resolve: async (_, args, { res, ...ctx }) => {
    // Check if user already exists
    const existingUser = await db.select()
      .from(users)
      .where(eq(users.email, args.input.email))
      .limit(1);

    if (existingUser.length > 0) {
      const error = new Error('User already exists');
      error.name = 'ConflictError';
      throw error;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(args.input.password, 10);

    // Create user
    const result = await db.insert(users).values({
      email: args.input.email,
      firstName: args.input.firstName,
      lastName: args.input.lastName,
      password: hashedPassword,
      phone: args.input.phone,
      role: 'customer',
      isActive: true,
      emailVerified: false,
    }).returning();

    const user = result[0];

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '7d' }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      secure: true,
      sameSite: 'none',
      maxAge: 15 * 60 * 60 * 1000 // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        avatar: user.avatar,
        emailVerified: user.emailVerified,
        role: user.role === 'merchant' ? 'restaurant' : user.role as "customer" | "courier" | "admin" | "restaurant",
        isActive: user.isActive,
        createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : String(user.createdAt),
        updatedAt: user.updatedAt instanceof Date ? user.updatedAt.toISOString() : String(user.updatedAt),
      },
    };
  },
});

export const login = mutationField('login', {
  type: 'AuthResponse',
  args: {
    input: nonNull(arg({ type: 'LoginInput' })),
  },
  resolve: async (_, args, { res, ...ctx }) => {
    // Find user
    const result = await db.select()
      .from(users)
      .where(eq(users.email, args.input.email))
      .limit(1);

    if (result.length === 0) {
      const error = new Error('Invalid credentials');
      error.name = 'AuthenticationError';
      throw error;
    }

    const user = result[0];

    // Check password
    const isValidPassword = await bcrypt.compare(args.input.password, user.password);
    if (!isValidPassword) {
      const error = new Error('Invalid credentials');
      error.name = 'AuthenticationError';
      throw error;
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      secure: true,
      sameSite: 'none',
      maxAge: 15 * 60 * 60 * 1000 // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        avatar: user.avatar,
        emailVerified: user.emailVerified,
        role: user.role === 'merchant' ? 'restaurant' : user.role as "customer" | "courier" | "admin" | "restaurant",
        isActive: user.isActive,
        createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : String(user.createdAt),
        updatedAt: user.updatedAt instanceof Date ? user.updatedAt.toISOString() : String(user.updatedAt),
      },
    };
  },
});

export const loginWithGoogle = mutationField('loginWithGoogle', {
  type: 'AuthResponse',
  args: {
    idToken: nonNull(stringArg()),
  },
  resolve: async (_, args, ctx) => {
    // This would need to be implemented with Google OAuth
    // For now, throwing an error
    const error = new Error('Google OAuth not implemented');
    error.name = 'NotImplementedError';
    throw error;
  },
});

export const refreshToken = mutationField('refreshToken', {
  type: 'RefreshTokenResponse',
  // args: {
  //   refreshToken: nonNull(stringArg()),
  // },
  resolve: async (_, args, { res, ...ctx }) => {
    try {
      const decoded = jwt.verify(ctx.refreshToken, process.env.JWT_REFRESH_SECRET) as any;
      
      const result = await db.select()
        .from(users)
        .where(eq(users.id, decoded.userId))
        .limit(1);

      if (result.length === 0) {
        const error = new Error('Invalid refresh token');
        error.name = 'AuthenticationError';
        throw error;
      }

      const user = result[0];

      // Generate new tokens
      const accessToken = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );

      const newRefreshToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
      );

      // Set cookies
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 15 * 60 * 60 * 1000 // 15 minutes
      });

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      // Return both tokens as an object
      return {
        message: "get refresh token success"
      };
    } catch (error) {
      const authError = new Error('Invalid refresh token');
      authError.name = 'AuthenticationError';
      throw authError;
    }
  },
});

export const logout = mutationField('logout', {
  type: 'LogoutResponse',
  resolve: async (_, args, {res, ...ctx}) => {
    // In a real implementation, you might want to blacklist the token
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: true,        // Must match login
      sameSite: 'none'     // Must match login
    });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    });
    return {message: "logout success"};
  },
});

export const updateUser = mutationField('updateUser', {
  type: 'AuthResponse',
  args: {
    input: nonNull(arg({type: "UpdateUserInput"}))
  },
  resolve: async (_, args, {res, ...ctx}) => {
    if (!ctx.user) {
      const error = new Error('Authentication required');
      error.name = 'AuthenticationError';
      throw error;
    }
    const user = await db.update(users).set(args.input)
    .where(eq(users.id, ctx.user.userId))
    .returning();
    return {
      user: {
        id: user[0].id,
        email: user[0].email,
        firstName: user[0].firstName,
        lastName: user[0].lastName,
        phone: user[0].phone,
        avatar: user[0].avatar,
        emailVerified: user[0].emailVerified,
        role: user[0].role === 'merchant' ? 'restaurant' : user[0].role as "customer" | "courier" | "admin" | "restaurant",
        isActive: user[0].isActive,
        createdAt: user[0].createdAt instanceof Date ? user[0].createdAt.toISOString() : String(user[0].createdAt),
        updatedAt: user[0].updatedAt instanceof Date ? user[0].updatedAt.toISOString() : String(user[0].updatedAt),
      }
    };
  },
});

// ===== CART MUTATIONS =====
export const addToCart = mutationField('addToCart', {
  type: 'CartItem',
  args: {
    input: nonNull(arg({ type: 'AddToCartInput' })),
  },
  resolve: async (_, args, ctx) => {
    if (!ctx.user) {
      const error = new Error('Authentication required');
      error.name = 'AuthenticationError';
      throw error;
    }

    // Get or create cart
    let cartResult = await db.select()
      .from(carts)
      .where(eq(carts.userId, ctx.user.userId))
      .limit(1);

    if (cartResult.length === 0) {
      // We need to get the restaurant ID from the menu item
      const menuItemResult = await db.select()
        .from(menuItems)
        .where(eq(menuItems.id, args.input.menuItemId))
        .limit(1);
      
      if (menuItemResult.length === 0) {
        throw new Error('Menu item not found');
      }

      const newCart = await db.insert(carts).values({
        userId: ctx.user.userId,
        restaurantId: menuItemResult[0].restaurantId,
      }).returning();
      cartResult = newCart;
    }

    // Check if item already exists in cart
    const existingItem = await db.select()
      .from(cartItems)
      .where(and(
        eq(cartItems.cartId, cartResult[0].id),
        eq(cartItems.menuItemId, args.input.menuItemId),
        eq(cartItems.selectedOptions, args.input.selectedOptions || '[]')
      ))
      .limit(1);

    if (existingItem.length > 0) {
      // Update quantity
      const result = await db.update(cartItems)
        .set({
          quantity: existingItem[0].quantity + args.input.quantity,
          updatedAt: new Date(),
        })
        .where(eq(cartItems.id, existingItem[0].id))
        .returning();
      return {
        id: result[0].id,
        cartId: result[0].cartId,
        menuItemId: result[0].menuItemId,
        quantity: result[0].quantity,
        selectedOptions: String(result[0].selectedOptions || '[]'),
        specialInstructions: result[0].specialInstructions || null,
        createdAt: result[0].createdAt instanceof Date ? result[0].createdAt.toISOString() : String(result[0].createdAt),
        updatedAt: result[0].updatedAt instanceof Date ? result[0].updatedAt.toISOString() : String(result[0].updatedAt),
      };
    } else {
      // Add new item
      const result = await db.insert(cartItems).values({
        cartId: cartResult[0].id,
        menuItemId: args.input.menuItemId,
        quantity: args.input.quantity,
        selectedOptions: args.input.selectedOptions || '[]',
        specialInstructions: args.input.specialInstructions || '',
      }).returning();
      return {
        id: result[0].id,
        cartId: result[0].cartId,
        menuItemId: result[0].menuItemId,
        quantity: result[0].quantity,
        selectedOptions: String(result[0].selectedOptions || '[]'),
        specialInstructions: result[0].specialInstructions || null,
        createdAt: result[0].createdAt instanceof Date ? result[0].createdAt.toISOString() : String(result[0].createdAt),
        updatedAt: result[0].updatedAt instanceof Date ? result[0].updatedAt.toISOString() : String(result[0].updatedAt),
      };
    }
  },
});

export const updateCartItem = mutationField('updateCartItem', {
  type: 'CartItem',
  args: {
    input: nonNull(arg({ type: 'UpdateCartItemInput' })),
  },
  resolve: async (_, args, ctx) => {
    if (!ctx.user) {
      const error = new Error('Authentication required');
      error.name = 'AuthenticationError';
      throw error;
    }

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (args.input.quantity !== undefined) {
      updateData.quantity = args.input.quantity;
    }
    if (args.input.selectedOptions !== undefined) {
      updateData.selectedOptions = args.input.selectedOptions;
    }
    if (args.input.specialInstructions !== undefined) {
      updateData.specialInstructions = args.input.specialInstructions;
    }

    const result = await db.update(cartItems)
      .set(updateData)
      .where(eq(cartItems.id, args.input.cartItemId))
      .returning();

        return {
        id: result[0].id,
        cartId: result[0].cartId,
        menuItemId: result[0].menuItemId,
        quantity: result[0].quantity,
        selectedOptions: String(result[0].selectedOptions || '[]'),
        specialInstructions: result[0].specialInstructions || null,
        createdAt: result[0].createdAt instanceof Date ? result[0].createdAt.toISOString() : String(result[0].createdAt),
        updatedAt: result[0].updatedAt instanceof Date ? result[0].updatedAt.toISOString() : String(result[0].updatedAt),
      };
  },
});

export const removeFromCart = mutationField('removeFromCart', {
  type: 'Boolean',
  args: {
    input: nonNull(arg({ type: 'RemoveFromCartInput' })),
  },
  resolve: async (_, args, ctx) => {
    if (!ctx.user) {
      const error = new Error('Authentication required');
      error.name = 'AuthenticationError';
      throw error;
    }

    await db.delete(cartItems)
      .where(eq(cartItems.id, args.input.cartItemId));

    return true;
  },
});

export const clearCart = mutationField('clearCart', {
  type: 'Boolean',
  resolve: async (_, args, ctx) => {
    if (!ctx.user) {
      const error = new Error('Authentication required');
      error.name = 'AuthenticationError';
      throw error;
    }

    // Get user's cart
    const cartResult = await db.select()
      .from(carts)
      .where(eq(carts.userId, ctx.user.userId))
      .limit(1);

    if (cartResult.length > 0) {
      // Delete all cart items
      await db.delete(cartItems)
        .where(eq(cartItems.cartId, cartResult[0].id));
    }

    return true;
  },
});

// ===== ORDER MUTATIONS =====
export const placeOrder = mutationField('placeOrder', {
  type: 'Order',
  args: {
    input: nonNull(arg({ type: 'CreateOrderInput' })),
  },
  resolve: async (_, args, ctx) => {
    if (!ctx.user) {
      const error = new Error('Authentication required');
      error.name = 'AuthenticationError';
      throw error;
    }

    if (ctx.user.role !== 'customer') {
      const error = new Error('Access denied. Customer role required');
      error.name = 'AuthorizationError';
      throw error;
    }

    // Get user's cart
    const cart = await db.select()
      .from(carts)
      .where(eq(carts.userId, ctx.user.userId))
      .limit(1);

    if (cart.length === 0) {
      const error = new Error('Cart is empty');
      error.name = 'ValidationError';
      throw error;
    }

    // Get cart items
    const cartItemsData = await db.select()
      .from(cartItems)
      .innerJoin(menuItems, eq(cartItems.menuItemId, menuItems.id))
      .where(eq(cartItems.cartId, cart[0].id));

    if (cartItemsData.length === 0) {
      const error = new Error('Cart is empty');
      error.name = 'ValidationError';
      throw error;
    }

    // Calculate totals
    const subtotal = cartItemsData.reduce((sum, item) => {
      const itemPrice = parseFloat(item.menu_items.price);
      const quantity = item.cart_items.quantity;
      return sum + (itemPrice * quantity);
    }, 0);

    const tax = subtotal * 0.08; // 8% tax
    const deliveryFee = 2.99;
    const tip = 0; // Tip not included in CreateOrderInput for now
    const total = subtotal + tax + deliveryFee + tip;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order
    const order = await db.insert(orders).values({
      orderNumber,
      customerId: ctx.user.userId,
      restaurantId: cart[0].restaurantId,
      status: 'pending',
      paymentStatus: 'pending',
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      deliveryFee: deliveryFee.toFixed(2),
      tip: tip.toFixed(2),
      total: total.toFixed(2),
      deliveryAddress: args.input.deliveryAddress,
      specialInstructions: args.input.specialInstructions,
    }).returning();

    // Create order items
    const orderItemsData = cartItemsData.map(item => ({
      orderId: order[0].id,
      menuItemId: item.cart_items.menuItemId,
      quantity: item.cart_items.quantity,
      unitPrice: item.menu_items.price,
      totalPrice: (parseFloat(item.menu_items.price) * item.cart_items.quantity).toFixed(2),
      selectedOptions: item.cart_items.selectedOptions,
      specialInstructions: item.cart_items.specialInstructions,
    }));

    await db.insert(orderItems).values(orderItemsData);

    // Create order event
    await db.insert(orderEvents).values({
      orderId: order[0].id,
      status: 'pending',
      message: 'Order created',
    });

    // Clear cart
    await db.delete(cartItems).where(eq(cartItems.cartId, cart[0].id));
    await db.delete(carts).where(eq(carts.id, cart[0].id));

    return {
      id: order[0].id,
      orderNumber: order[0].orderNumber,
      customerId: order[0].customerId,
      restaurantId: order[0].restaurantId,
      courierId: order[0].courierId || null,
      status: order[0].status,
      paymentStatus: order[0].paymentStatus,
      subtotal: String(order[0].subtotal),
      tax: String(order[0].tax),
      deliveryFee: String(order[0].deliveryFee),
      tip: String(order[0].tip),
      total: String(order[0].total),
      deliveryAddress: String(order[0].deliveryAddress),
      specialInstructions: order[0].specialInstructions || null,
      estimatedDeliveryTime: order[0].estimatedDeliveryTime ? (order[0].estimatedDeliveryTime instanceof Date ? order[0].estimatedDeliveryTime.toISOString() : String(order[0].estimatedDeliveryTime)) : null,
      stripePaymentIntentId: order[0].stripePaymentIntentId || null,
      stripeSessionId: order[0].stripeSessionId || null,
      createdAt: order[0].createdAt instanceof Date ? order[0].createdAt.toISOString() : String(order[0].createdAt),
      updatedAt: order[0].updatedAt instanceof Date ? order[0].updatedAt.toISOString() : String(order[0].updatedAt),
    };
  },
});

export const confirmOrder = mutationField('confirmOrder', {
  type: 'Order',
  args: {
    orderId: nonNull(stringArg()),
  },
  resolve: async (_, args, ctx) => {
    if (!ctx.user) {
      const error = new Error('Authentication required');
      error.name = 'AuthenticationError';
      throw error;
    }

    if (ctx.user.role !== 'merchant') {
      const error = new Error('Access denied. Merchant role required');
      error.name = 'AuthorizationError';
      throw error;
    }

    // Check if user owns the restaurant for this order
    const order = await db.select()
      .from(orders)
      .where(eq(orders.id, args.orderId))
      .limit(1);

    if (order.length === 0) {
      const error = new Error('Order not found');
      error.name = 'NotFoundError';
      throw error;
    }

    const restaurant = await db.select()
      .from(restaurants)
      .where(eq(restaurants.id, order[0].restaurantId))
      .limit(1);

    if (restaurant.length === 0 || restaurant[0].ownerId !== ctx.user.userId) {
      const error = new Error('Access denied');
      error.name = 'AuthorizationError';
      throw error;
    }

    // Update order status
    const updatedOrder = await db.update(orders)
      .set({
        status: 'confirmed',
        updatedAt: new Date(),
      })
      .where(eq(orders.id, args.orderId))
      .returning();

    // Create order event
    await db.insert(orderEvents).values({
      orderId: args.orderId,
      status: 'confirmed',
      message: 'Order confirmed by restaurant',
    });

    return {
      id: updatedOrder[0].id,
      orderNumber: updatedOrder[0].orderNumber,
      customerId: updatedOrder[0].customerId,
      restaurantId: updatedOrder[0].restaurantId,
      courierId: updatedOrder[0].courierId || null,
      status: updatedOrder[0].status,
      paymentStatus: updatedOrder[0].paymentStatus,
      subtotal: String(updatedOrder[0].subtotal),
      tax: String(updatedOrder[0].tax),
      deliveryFee: String(updatedOrder[0].deliveryFee),
      tip: String(updatedOrder[0].tip),
      total: String(updatedOrder[0].total),
      deliveryAddress: String(updatedOrder[0].deliveryAddress),
      specialInstructions: updatedOrder[0].specialInstructions || null,
      estimatedDeliveryTime: updatedOrder[0].estimatedDeliveryTime ? (updatedOrder[0].estimatedDeliveryTime instanceof Date ? updatedOrder[0].estimatedDeliveryTime.toISOString() : String(updatedOrder[0].estimatedDeliveryTime)) : null,
      stripePaymentIntentId: updatedOrder[0].stripePaymentIntentId || null,
      stripeSessionId: updatedOrder[0].stripeSessionId || null,
      createdAt: updatedOrder[0].createdAt instanceof Date ? updatedOrder[0].createdAt.toISOString() : String(updatedOrder[0].createdAt),
      updatedAt: updatedOrder[0].updatedAt instanceof Date ? updatedOrder[0].updatedAt.toISOString() : String(updatedOrder[0].updatedAt),
    };
  },
});

// ===== COURIER MUTATIONS =====
export const acceptDelivery = mutationField('acceptDelivery', {
  type: 'Delivery',
  args: {
    deliveryId: nonNull(stringArg()),
  },
  resolve: async (_, args, ctx) => {
    if (!ctx.user) {
      const error = new Error('Authentication required');
      error.name = 'AuthenticationError';
      throw error;
    }

    if (ctx.user.role !== 'courier') {
      const error = new Error('Access denied. Courier role required');
      error.name = 'AuthorizationError';
      throw error;
    }

    // Check if courier is available
    const profile = await db.select()
      .from(courierProfiles)
      .where(eq(courierProfiles.userId, ctx.user.userId))
      .limit(1);

    if (profile.length === 0 || !profile[0].isAvailable) {
      const error = new Error('Courier is not available');
      error.name = 'ValidationError';
      throw error;
    }

    // Check if delivery exists and is assigned
    const delivery = await db.select()
      .from(deliveries)
      .where(eq(deliveries.id, args.deliveryId))
      .limit(1);

    if (delivery.length === 0) {
      const error = new Error('Delivery not found');
      error.name = 'NotFoundError';
      throw error;
    }

    if (delivery[0].status !== 'assigned') {
      const error = new Error('Delivery is not available for acceptance');
      error.name = 'ValidationError';
      throw error;
    }

    // Update delivery status
    const result = await db.update(deliveries)
      .set({
        status: 'accepted',
        acceptedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(deliveries.id, args.deliveryId))
      .returning();

        return {
        ...result[0],
        createdAt: result[0].createdAt instanceof Date ? result[0].createdAt.toISOString() : String(result[0].createdAt),
        updatedAt: result[0].updatedAt instanceof Date ? result[0].updatedAt.toISOString() : String(result[0].updatedAt),
      };
  },
});

export const pickupOrder = mutationField('pickupOrder', {
  type: 'Delivery',
  args: {
    deliveryId: nonNull(stringArg()),
  },
  resolve: async (_, args, ctx) => {
    if (!ctx.user) {
      const error = new Error('Authentication required');
      error.name = 'AuthenticationError';
      throw error;
    }

    if (ctx.user.role !== 'courier') {
      const error = new Error('Access denied. Courier role required');
      error.name = 'AuthorizationError';
      throw error;
    }

    // Check if courier owns this delivery
    const delivery = await db.select()
      .from(deliveries)
      .where(eq(deliveries.id, args.deliveryId))
      .limit(1);

    if (delivery.length === 0) {
      const error = new Error('Delivery not found');
      error.name = 'NotFoundError';
      throw error;
    }

    if (delivery[0].courierId !== ctx.user.userId) {
      const error = new Error('Access denied');
      error.name = 'AuthorizationError';
      throw error;
    }

    // Update delivery status
    const result = await db.update(deliveries)
      .set({
        status: 'picked_up',
        pickedUpAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(deliveries.id, args.deliveryId))
      .returning();

        return {
        ...result[0],
        createdAt: result[0].createdAt instanceof Date ? result[0].createdAt.toISOString() : String(result[0].createdAt),
        updatedAt: result[0].updatedAt instanceof Date ? result[0].updatedAt.toISOString() : String(result[0].updatedAt),
      };
  },
});

export const deliverOrder = mutationField('deliverOrder', {
  type: 'Delivery',
  args: {
    deliveryId: nonNull(stringArg()),
  },
  resolve: async (_, args, ctx) => {
    if (!ctx.user) {
      const error = new Error('Authentication required');
      error.name = 'AuthenticationError';
      throw error;
    }

    if (ctx.user.role !== 'courier') {
      const error = new Error('Access denied. Courier role required');
      error.name = 'AuthorizationError';
      throw error;
    }

    // Check if courier owns this delivery
    const delivery = await db.select()
      .from(deliveries)
      .where(eq(deliveries.id, args.deliveryId))
      .limit(1);

    if (delivery.length === 0) {
      const error = new Error('Delivery not found');
      error.name = 'NotFoundError';
      throw error;
    }

    if (delivery[0].courierId !== ctx.user.userId) {
      const error = new Error('Access denied');
      error.name = 'AuthorizationError';
      throw error;
    }

    // Update delivery status
    const result = await db.update(deliveries)
      .set({
        status: 'delivered',
        deliveredAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(deliveries.id, args.deliveryId))
      .returning();

        return {
        ...result[0],
        createdAt: result[0].createdAt instanceof Date ? result[0].createdAt.toISOString() : String(result[0].createdAt),
        updatedAt: result[0].updatedAt instanceof Date ? result[0].updatedAt.toISOString() : String(result[0].updatedAt),
      };
  },
});

export const updateCourierLocation = mutationField('updateCourierLocation', {
  type: 'CourierProfile',
  args: {
    input: nonNull(arg({ type: 'UpdateCourierLocationInput' })),
  },
  resolve: async (_, args, ctx) => {
    if (!ctx.user) {
      const error = new Error('Authentication required');
      error.name = 'AuthenticationError';
      throw error;
    }

    if (ctx.user.role !== 'courier') {
      const error = new Error('Access denied. Courier role required');
      error.name = 'AuthorizationError';
      throw error;
    }

    const location = {
      latitude: args.input.latitude,
      longitude: args.input.longitude,
    };

    const result = await db.update(courierProfiles)
      .set({
        currentLocation: JSON.stringify(location),
        updatedAt: new Date(),
      })
      .where(eq(courierProfiles.userId, ctx.user.userId))
      .returning();

    if (result.length === 0) {
      const error = new Error('Courier profile not found');
      error.name = 'NotFoundError';
      throw error;
    }

    return {
      id: result[0].id,
      userId: result[0].userId,
      vehicleType: result[0].vehicleType as "bike" | "car" | "motorcycle",
      licensePlate: result[0].licensePlate || null,
      isAvailable: result[0].isAvailable,
      rating: parseFloat(result[0].rating),
      reviewCount: result[0].reviewCount,
      totalDeliveries: result[0].totalDeliveries,
      createdAt: result[0].createdAt instanceof Date ? result[0].createdAt.toISOString() : String(result[0].createdAt),
      updatedAt: result[0].updatedAt instanceof Date ? result[0].updatedAt.toISOString() : String(result[0].updatedAt),
    };
  },
});

// ===== RESTAURANT MUTATIONS =====
export const toggleFavorite = mutationField('toggleFavorite', {
  type: 'Boolean',
  args: {
    restaurantId: nonNull(stringArg()),
  },
  resolve: async (_, args, ctx) => {
    if (!ctx.user) {
      const error = new Error('Authentication required');
      error.name = 'AuthenticationError';
      throw error;
    }

    // Check if restaurant exists
    const restaurant = await db
      .select()
      .from(restaurants)
      .where(eq(restaurants.id, args.restaurantId))
      .limit(1);

    if (restaurant.length === 0) {
      const error = new Error('Restaurant not found');
      error.name = 'NotFoundError';
      throw error;
    }

    // Check if already favorited
    const existingFavorite = await db
      .select()
      .from(favorites)
      .where(
        and(
          eq(favorites.userId, ctx.user.userId),
          eq(favorites.restaurantId, args.restaurantId)
        )
      )
      .limit(1);

    if (existingFavorite.length > 0) {
      // Remove from favorites
      await db
        .delete(favorites)
        .where(
          and(
            eq(favorites.userId, ctx.user.userId),
            eq(favorites.restaurantId, args.restaurantId)
          )
        );
      return false; // Removed from favorites
    } else {
      // Add to favorites
      await db.insert(favorites).values({
        userId: ctx.user.userId,
        restaurantId: args.restaurantId,
      });
      return true; // Added to favorites
    }
  },
});

export const setRestaurantOpen = mutationField('setRestaurantOpen', {
  type: 'Restaurant',
  args: {
    id: nonNull(stringArg()),
    isOpen: nonNull(booleanArg()),
  },
  resolve: async (_, args, ctx) => {
    if (!ctx.user) {
      const error = new Error('Authentication required');
      error.name = 'AuthenticationError';
      throw error;
    }

    if (ctx.user.role !== 'merchant') {
      const error = new Error('Access denied. Merchant role required');
      error.name = 'AuthorizationError';
      throw error;
    }

    // Check if user owns this restaurant
    const restaurant = await db.select()
      .from(restaurants)
      .where(eq(restaurants.id, args.id))
      .limit(1);

    if (restaurant.length === 0) {
      const error = new Error('Restaurant not found');
      error.name = 'NotFoundError';
      throw error;
    }

    if (restaurant[0].ownerId !== ctx.user.userId) {
      const error = new Error('Access denied');
      error.name = 'AuthorizationError';
      throw error;
    }

    // Update restaurant
    const result = await db.update(restaurants)
      .set({
        isOpen: args.isOpen,
        updatedAt: new Date(),
      })
      .where(eq(restaurants.id, args.id))
      .returning();

    return {
        ...result[0],
        createdAt: result[0].createdAt instanceof Date ? result[0].createdAt.toISOString() : String(result[0].createdAt),
        updatedAt: result[0].updatedAt instanceof Date ? result[0].updatedAt.toISOString() : String(result[0].updatedAt),
      };
  },
});

// ===== REVIEW MUTATIONS =====
export const createReview = mutationField('createReview', {
  type: 'Review',
  args: {
    input: nonNull(arg({ type: 'CreateReviewInput' })),
  },
  resolve: async (_, args, ctx) => {
    if (!ctx.user) {
      const error = new Error('Authentication required');
      error.name = 'AuthenticationError';
      throw error;
    }

    const result = await db.insert(reviews).values({
      orderId: args.input.orderId,
      customerId: ctx.user.userId,
      rating: args.input.rating,
      comment: args.input.comment,
      type: args.input.type,
    }).returning();

    return {
        id: result[0].id,
        orderId: result[0].orderId,
        customerId: result[0].customerId,
        rating: result[0].rating,
        type: result[0].type as "courier" | "restaurant",
        comment: result[0].comment || null,
        createdAt: result[0].createdAt instanceof Date ? result[0].createdAt.toISOString() : String(result[0].createdAt),
        updatedAt: result[0].updatedAt instanceof Date ? result[0].updatedAt.toISOString() : String(result[0].updatedAt),
      };
  },
});

// ===== PAYMENT MUTATIONS =====
export const createCheckoutSession = mutationField('createCheckoutSession', {
  type: 'CheckoutSession',
  args: {
    input: nonNull(arg({ type: 'CreateCheckoutSessionInput' })),
  },
  resolve: async (_, args, ctx) => {
    if (!ctx.user) {
      const error = new Error('Authentication required');
      error.name = 'AuthenticationError';
      throw error;
    }

    // This would integrate with Stripe
    // For now, returning a mock response
    return {
      id: `cs_${Date.now()}`,
      url: 'https://checkout.stripe.com/mock-session',
      successUrl: args.input.successUrl,
      cancelUrl: args.input.cancelUrl,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      status: 'open',
      paymentIntentId: "",
      customerEmail: ctx.user.email,
      customerId: ctx.user.userId,
    };
  },
});

export const createBillingPortalSession = mutationField('createBillingPortalSession', {
  type: 'BillingPortalSession',
  args: {
    input: nonNull(arg({ type: 'CreateBillingPortalSessionInput' })),
  },
  resolve: async (_, args, ctx) => {
    if (!ctx.user) {
      const error = new Error('Authentication required');
      error.name = 'AuthenticationError';
      throw error;
    }

    // This would integrate with Stripe
    // For now, returning a mock response
    return {
      id: `bps_${Date.now()}`,
      url: 'https://billing.stripe.com/mock-portal',
      createdAt: new Date().toISOString(),
      returnUrl: args.input.returnUrl,
    };
  },
});

export const createPaymentIntent = mutationField('createPaymentIntent', {
  type: 'PaymentIntent',
  args: {
    input: nonNull(arg({ type: 'CreatePaymentIntentInput' })),
  },
  resolve: async (_, args, ctx) => {
    if (!ctx.user) {
      const error = new Error('Authentication required');
      error.name = 'AuthenticationError';
      throw error;
    }

    // This would integrate with Stripe
    // For now, returning a mock response
    return {
      id: `pi_${Date.now()}`,
      clientSecret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
      amount: args.input.amount,
      currency: args.input.currency,
      description: "",
      metadata: "",
      status: 'requires_payment_method',
      createdAt: new Date().toISOString(),
    };
  },
});

export const confirmPaymentIntent = mutationField('confirmPaymentIntent', {
  type: 'PaymentIntent',
  args: {
    paymentIntentId: nonNull(stringArg()),
  },
  resolve: async (_, args, ctx) => {
    if (!ctx.user) {
      const error = new Error('Authentication required');
      error.name = 'AuthenticationError';
      throw error;
    }

    // This would integrate with Stripe
    // For now, returning a mock response
    return {
      id: args.paymentIntentId,
      clientSecret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
      amount: '2000',
      currency: 'usd',
      status: 'succeeded',
      description: "",
      metadata: "",
      createdAt: new Date().toISOString(),
    };
  },
});

export const cancelPaymentIntent = mutationField('cancelPaymentIntent', {
  type: 'PaymentIntent',
  args: {
    paymentIntentId: nonNull(stringArg()),
  },
  resolve: async (_, args, ctx) => {
    if (!ctx.user) {
      const error = new Error('Authentication required');
      error.name = 'AuthenticationError';
      throw error;
    }

    // This would integrate with Stripe
    // For now, returning a mock response
    return {
      id: args.paymentIntentId,
      clientSecret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
      amount: '2000',
      currency: 'usd',
      status: 'canceled',
      description: "",
      metadata: "",
      createdAt: new Date().toISOString(),
    };
  },
});

export const createRefund = mutationField('createRefund', {
  type: 'Refund',
  args: {
    input: nonNull(arg({ type: 'CreateRefundInput' })),
  },
  resolve: async (_, args, ctx) => {
    if (!ctx.user) {
      const error = new Error('Authentication required');
      error.name = 'AuthenticationError';
      throw error;
    }

    // This would integrate with Stripe
    // For now, returning a mock response
    return {
      id: `re_${Date.now()}`,
      amount: args.input.amount || '0',
      currency: 'usd', // Default currency since it's not in input
      status: 'succeeded',
      reason: args.input.reason,
      createdAt: new Date().toISOString(),
    };
  },
});
