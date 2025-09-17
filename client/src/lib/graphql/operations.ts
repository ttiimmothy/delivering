import { gql } from '@apollo/client';

// ===== AUTHENTICATION =====
export const loginMutation = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      refreshToken
      user {
        id
        email
        firstName
        lastName
        role
        avatar
        isActive
        emailVerified
        createdAt
        updatedAt
      }
    }
  }
`;

export const signupMutation = gql`
  mutation Signup($input: SignupInput!) {
    signup(input: $input) {
      accessToken
      refreshToken
      user {
        id
        email
        firstName
        lastName
        role
        avatar
        isActive
        emailVerified
        createdAt
        updatedAt
      }
    }
  }
`;

export const loginWithGoogleMutation = gql`
  mutation LoginWithGoogle($idToken: String!) {
    loginWithGoogle(idToken: $idToken) {
      accessToken
      refreshToken
      user {
        id
        email
        firstName
        lastName
        role
        avatar
        isActive
        emailVerified
        createdAt
        updatedAt
      }
    }
  }
`;

export const refreshTokenMutation = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      accessToken
      refreshToken
    }
  }
`;

export const logoutMutation = gql`
  mutation Logout {
    logout
  }
`;

export const meQuery = gql`
  query Me {
    me {
      id
      email
      firstName
      lastName
      phone
      role
      avatar
      isActive
      emailVerified
      createdAt
      updatedAt
      addresses {
        id
        label
        street
        city
        state
        zipCode
        country
        latitude
        longitude
        isDefault
        createdAt
        updatedAt
      }
      courierProfile {
        id
        vehicleType
        licensePlate
        isAvailable
        currentLocation
        rating
        reviewCount
        totalDeliveries
        createdAt
        updatedAt
      }
    }
  }
`;

// ===== RESTAURANTS =====
export const restaurantsQuery = gql`
  query Restaurants(
    $cuisine: String
    $isOpen: Boolean
    $limit: Int
    $offset: Int
    $search: String
    $sortBy: String
    $sortOrder: String
  ) {
    restaurants(
      cuisine: $cuisine
      isOpen: $isOpen
      limit: $limit
      offset: $offset
      search: $search
      sortBy: $sortBy
      sortOrder: $sortOrder
    ) {
      id
      name
      slug
      description
      image
      cuisine
      rating
      reviewCount
      deliveryTime
      deliveryFee
      minimumOrder
      isOpen
      isActive
      address {
        street
        city
        state
        zipCode
        latitude
        longitude
      }
      phone
      createdAt
      updatedAt
      isFavorite
    }
  }
`;

export const restaurantQuery = gql`
  query Restaurant($slug: String!) {
    restaurant(slug: $slug) {
      id
      name
      slug
      description
      image
      cuisine
      rating
      reviewCount
      deliveryTime
      deliveryFee
      minimumOrder
      isOpen
      isActive
      address {
        street
        city
        state
        zipCode
        latitude
        longitude
      }
      phone
      createdAt
      updatedAt
      menuCategories {
        id
        name
        description
        sortOrder
        isActive
        createdAt
        updatedAt
        menuItems {
          id
          name
          description
          image
          price
          isAvailable
          isPopular
          sortOrder
          createdAt
          updatedAt
          options {
            id
            name
            type
            isRequired
            sortOrder
            createdAt
            values {
              id
              name
              price
              isDefault
              sortOrder
              createdAt
            }
          }
        }
      }
    }
  }
`;

export const favoriteRestaurantsQuery = gql`
  query FavoriteRestaurants {
    favoriteRestaurants {
      id
      name
      slug
      description
      image
      cuisine
      rating
      reviewCount
      deliveryTime
      deliveryFee
      minimumOrder
      isOpen
      isActive
      address {
        street
        city
        state
        zipCode
        latitude
        longitude
      }
      phone
      createdAt
      updatedAt
    }
  }
`;

export const toggleFavoriteMutation = gql`
  mutation ToggleFavorite($restaurantId: String!) {
    toggleFavorite(restaurantId: $restaurantId)
  }
`;

// ===== CART =====
export const cartQuery = gql`
  query Cart {
    cart {
      id
      restaurantId
      createdAt
      updatedAt
      items {
        id
        menuItemId
        quantity
        selectedOptions
        specialInstructions
        createdAt
        updatedAt
        menuItem {
          id
          name
          description
          image
          price
          isAvailable
          isPopular
          options {
            id
            name
            type
            isRequired
            values {
              id
              name
              price
              isDefault
            }
          }
        }
      }
    }
  }
`;

export const addToCartMutation = gql`
  mutation AddToCart($input: AddToCartInput!) {
    addToCart(input: $input) {
      id
      menuItemId
      quantity
      selectedOptions
      specialInstructions
      createdAt
      updatedAt
    }
  }
`;

export const updateCartItemMutation = gql`
  mutation UpdateCartItem($input: UpdateCartItemInput!) {
    updateCartItem(input: $input) {
      id
      quantity
      selectedOptions
      specialInstructions
      updatedAt
    }
  }
`;

export const removeFromCartMutation = gql`
  mutation RemoveFromCart($input: RemoveFromCartInput!) {
    removeFromCart(input: $input)
  }
`;

export const clearCartMutation = gql`
  mutation ClearCart {
    clearCart
  }
`;

// ===== ORDERS =====
export const ordersQuery = gql`
  query Orders($status: OrderStatus, $limit: Int, $offset: Int) {
    orders(status: $status, limit: $limit, offset: $offset) {
      id
      orderNumber
      status
      paymentStatus
      subtotal
      tax
      deliveryFee
      tip
      total
      deliveryAddress
      specialInstructions
      estimatedDeliveryTime
      createdAt
      updatedAt
      restaurant {
        id
        name
        slug
        image
        phone
      }
      courier {
        id
        firstName
        lastName
        phone
        courierProfile {
          vehicleType
          rating
        }
      }
      items {
        id
        menuItemId
        quantity
        unitPrice
        totalPrice
        selectedOptions
        specialInstructions
        menuItem {
          id
          name
          description
          image
        }
      }
      events {
        id
        status
        message
        metadata
        createdAt
      }
    }
  }
`;

export const orderQuery = gql`
  query Order($id: String!) {
    order(id: $id) {
      id
      orderNumber
      status
      paymentStatus
      subtotal
      tax
      deliveryFee
      tip
      total
      deliveryAddress
      specialInstructions
      estimatedDeliveryTime
      createdAt
      updatedAt
      restaurant {
        id
        name
        slug
        image
        phone
        address {
          street
          city
          state
          zipCode
        }
      }
      courier {
        id
        firstName
        lastName
        phone
        courierProfile {
          vehicleType
          rating
          currentLocation {
            latitude
            longitude
            timestamp
          }
        }
      }
      items {
        id
        menuItemId
        quantity
        unitPrice
        totalPrice
        selectedOptions
        specialInstructions
        menuItem {
          id
          name
          description
          image
        }
      }
      events {
        id
        status
        message
        metadata
        createdAt
      }
    }
  }
`;

export const placeOrderMutation = gql`
  mutation PlaceOrder($input: CreateOrderInput!) {
    placeOrder(input: $input) {
      id
      orderNumber
      status
      paymentStatus
      total
      estimatedDeliveryTime
      createdAt
    }
  }
`;

// ===== COURIER =====
export const courierAssignmentsQuery = gql`
  query CourierAssignments {
    courierAssignments {
      id
      orderId
      status
      assignedAt
      acceptedAt
      pickedUpAt
      deliveredAt
      currentLocation {
        latitude
        longitude
        timestamp
      }
      estimatedArrival
      order {
        id
        orderNumber
        status
        total
        deliveryAddress
        specialInstructions
        restaurant {
          id
          name
          address {
            street
            city
            state
            zipCode
            latitude
            longitude
          }
        }
        customer {
          id
          firstName
          lastName
          phone
        }
      }
    }
  }
`;

export const acceptDeliveryMutation = gql`
  mutation AcceptDelivery($deliveryId: String!) {
    acceptDelivery(deliveryId: $deliveryId) {
      id
      status
      acceptedAt
    }
  }
`;

export const pickupOrderMutation = gql`
  mutation PickupOrder($deliveryId: String!) {
    pickupOrder(deliveryId: $deliveryId) {
      id
      status
      pickedUpAt
    }
  }
`;

export const deliverOrderMutation = gql`
  mutation DeliverOrder($deliveryId: String!) {
    deliverOrder(deliveryId: $deliveryId) {
      id
      status
      deliveredAt
    }
  }
`;

export const updateCourierLocationMutation = gql`
  mutation UpdateCourierLocation($input: UpdateCourierLocationInput!) {
    updateCourierLocation(input: $input) {
      id
      currentLocation {
        latitude
        longitude
        timestamp
      }
      updatedAt
    }
  }
`;

// ===== MERCHANT =====
export const merchantOrdersQuery = gql`
  query MerchantOrders($status: OrderStatus, $limit: Int, $offset: Int) {
    merchantOrders(status: $status, limit: $limit, offset: $offset) {
      id
      orderNumber
      status
      paymentStatus
      subtotal
      tax
      deliveryFee
      tip
      total
      deliveryAddress
      specialInstructions
      estimatedDeliveryTime
      createdAt
      updatedAt
      customer {
        id
        firstName
        lastName
        phone
      }
      courier {
        id
        firstName
        lastName
        phone
      }
      items {
        id
        menuItemId
        quantity
        unitPrice
        totalPrice
        selectedOptions
        specialInstructions
        menuItem {
          id
          name
          description
          image
        }
      }
    }
  }
`;

export const confirmOrderMutation = gql`
  mutation ConfirmOrder($orderId: String!) {
    confirmOrder(orderId: $orderId) {
      id
      status
      updatedAt
    }
  }
`;

export const setRestaurantOpenMutation = gql`
  mutation SetRestaurantOpen($id: String!, $isOpen: Boolean!) {
    setRestaurantOpen(id: $id, isOpen: $isOpen) {
      id
      isOpen
      updatedAt
    }
  }
`;

// ===== REVIEWS =====
export const reviewsQuery = gql`
  query Reviews($restaurantId: String, $courierId: String, $limit: Int, $offset: Int) {
    reviews(restaurantId: $restaurantId, courierId: $courierId, limit: $limit, offset: $offset) {
      id
      rating
      comment
      type
      createdAt
      updatedAt
      customer {
        id
        firstName
        lastName
      }
      restaurant {
        id
        name
        slug
      }
      courier {
        id
        firstName
        lastName
      }
    }
  }
`;

export const createReviewMutation = gql`
  mutation CreateReview($input: CreateReviewInput!) {
    createReview(input: $input) {
      id
      rating
      comment
      type
      createdAt
    }
  }
`;

// ===== SUBSCRIPTIONS =====
// Note: Subscriptions are not currently implemented in the server
// These are placeholder operations for future real-time features


export const orderStatusChangedSubscription = gql`
  subscription OrderStatusChanged($orderId: String!) {
    orderStatusChanged(orderId: $orderId) {
      id
      status
      message
      metadata
      createdAt
    }
  }
`;

export const courierLocationSubscription = gql`
  subscription CourierLocation($deliveryId: String!) {
    courierLocation(deliveryId: $deliveryId) {
      courierId
      deliveryId
      location {
        latitude
        longitude
        timestamp
      }
      estimatedArrival
      timestamp
    }
  }
`;

export const merchantIncomingOrdersSubscription = gql`
  subscription MerchantIncomingOrders($restaurantId: String!) {
    merchantIncomingOrders(restaurantId: $restaurantId) {
      id
      orderNumber
      status
      total
      deliveryAddress
      specialInstructions
      createdAt
      customer {
        id
        firstName
        lastName
        phone
      }
      items {
        id
        quantity
        menuItem {
          id
          name
          price
        }
      }
    }
  }
`;

// ===== PAYMENT OPERATIONS =====
export const createCheckoutSessionMutation = gql`
  mutation CreateCheckoutSession($input: CreateCheckoutSessionInput!) {
    createCheckoutSession(input: $input) {
      id
      url
      customerId
      customerEmail
      status
      paymentIntentId
      createdAt
      expiresAt
    }
  }
`;

export const createBillingPortalSessionMutation = gql`
  mutation CreateBillingPortalSession($input: CreateBillingPortalSessionInput!) {
    createBillingPortalSession(input: $input) {
      id
      url
      returnUrl
      createdAt
    }
  }
`;

export const createPaymentIntentMutation = gql`
  mutation CreatePaymentIntent($input: CreatePaymentIntentInput!) {
    createPaymentIntent(input: $input) {
      id
      status
      amount
      currency
      clientSecret
      description
      createdAt
      metadata
    }
  }
`;

export const confirmPaymentIntentMutation = gql`
  mutation ConfirmPaymentIntent($paymentIntentId: String!) {
    confirmPaymentIntent(paymentIntentId: $paymentIntentId) {
      id
      status
      amount
      currency
      clientSecret
      description
      createdAt
      metadata
    }
  }
`;

export const cancelPaymentIntentMutation = gql`
  mutation CancelPaymentIntent($paymentIntentId: String!) {
    cancelPaymentIntent(paymentIntentId: $paymentIntentId) {
      id
      status
      amount
      currency
      clientSecret
      description
      createdAt
      metadata
    }
  }
`;

export const createRefundMutation = gql`
  mutation CreateRefund($input: CreateRefundInput!) {
    createRefund(input: $input) {
      id
      status
      amount
      currency
      reason
      createdAt
    }
  }
`;

export const paymentIntentQuery = gql`
  query PaymentIntent($paymentIntentId: String!) {
    paymentIntent(paymentIntentId: $paymentIntentId) {
      id
      status
      amount
      currency
      clientSecret
      description
      createdAt
      metadata
    }
  }
`;

// ===== ADDITIONAL SUBSCRIPTIONS =====
export const deliveryAssignedSubscription = gql`
  subscription DeliveryAssigned($courierId: String!) {
    deliveryAssigned(courierId: $courierId) {
      deliveryId
      courierId
      assignedBy
      timestamp
    }
  }
`;

export const deliveryStatusChangedSubscription = gql`
  subscription DeliveryStatusChanged($deliveryId: String!) {
    deliveryStatusChanged(deliveryId: $deliveryId) {
      deliveryId
      status
      message
      timestamp
    }
  }
`;

export const courierStatusChangedSubscription = gql`
  subscription CourierStatusChanged {
    courierStatusChanged {
      courierId
      isAvailable
      timestamp
    }
  }
`;

export const realTimeOrderUpdatesSubscription = gql`
  subscription RealTimeOrderUpdates($orderId: String!) {
    realTimeOrderUpdates(orderId: $orderId) {
      orderId
      status
      message
      metadata
      timestamp
    }
  }
`;

export const liveCourierTrackingSubscription = gql`
  subscription LiveCourierTracking($courierId: String!) {
    liveCourierTracking(courierId: $courierId) {
      courierId
      deliveryId
      location {
        latitude
        longitude
        timestamp
      }
      estimatedArrival
      timestamp
    }
  }
`;

export const restaurantOrderQueueSubscription = gql`
  subscription RestaurantOrderQueue($restaurantId: String!) {
    restaurantOrderQueue(restaurantId: $restaurantId) {
      restaurantId
      pendingOrders {
        id
        orderNumber
        status
        total
        createdAt
        customer {
          id
          firstName
          lastName
        }
      }
      preparingOrders {
        id
        orderNumber
        status
        total
        createdAt
        customer {
          id
          firstName
          lastName
        }
      }
      readyOrders {
        id
        orderNumber
        status
        total
        createdAt
        customer {
          id
          firstName
          lastName
        }
      }
      timestamp
    }
  }
`;

export const customerOrderTrackingSubscription = gql`
  subscription CustomerOrderTracking($orderId: String!) {
    customerOrderTracking(orderId: $orderId) {
      orderId
      status
      courier {
        id
        firstName
        lastName
        phone
      }
      currentLocation {
        latitude
        longitude
        timestamp
      }
      estimatedDelivery
      timestamp
    }
  }
`;