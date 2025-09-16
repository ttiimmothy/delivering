import { objectType, inputObjectType, nonNull, intArg, stringArg, arg } from 'nexus';

// Types
export const CheckoutSession = objectType({
  name: 'CheckoutSession',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('url');
    t.nonNull.string('createdAt');
    t.nonNull.string('expiresAt');
    t.nonNull.string('status');
    t.nonNull.string('customerEmail');
    t.nonNull.string('customerId');
  },
});

export const BillingPortalSession = objectType({
  name: 'BillingPortalSession',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('url');
    t.nonNull.string('createdAt');
    t.nonNull.string('returnUrl');
  },
});

export const PaymentIntent = objectType({
  name: 'PaymentIntent',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('clientSecret');
    t.nonNull.string('status');
    t.nonNull.string('amount');
    t.nonNull.string('currency');
    t.nonNull.string('createdAt');
  },
});

export const Refund = objectType({
  name: 'Refund',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('amount');
    t.nonNull.string('currency');
    t.nonNull.string('status');
    t.nonNull.string('reason');
    t.nonNull.string('createdAt');
  },
});

// Input Types
export const CreateCheckoutSessionInput = inputObjectType({
  name: 'CreateCheckoutSessionInput',
  definition(t) {
    t.nonNull.string('priceId');
    t.nonNull.string('successUrl');
    t.nonNull.string('cancelUrl');
  },
});

export const CreateBillingPortalSessionInput = inputObjectType({
  name: 'CreateBillingPortalSessionInput',
  definition(t) {
    t.nonNull.string('customerId');
    t.nonNull.string('returnUrl');
  },
});

export const CreatePaymentIntentInput = inputObjectType({
  name: 'CreatePaymentIntentInput',
  definition(t) {
    t.nonNull.string('amount');
    t.nonNull.string('currency');
  },
});

export const CreateRefundInput = inputObjectType({
  name: 'CreateRefundInput',
  definition(t) {
    t.nonNull.string('paymentIntentId');
    t.string('amount');
    t.string('reason');
  },
});