# When to Mock

Mock at **system boundaries** only:

- External APIs (payment, email, etc.)
- Databases (sometimes - prefer test DB)
- Time/randomness
- File system (sometimes)

Don't mock:

- Your own classes/modules
- Internal collaborators
- Anything you control

## Designing for Mockability

At system boundaries, design interfaces that are easy to mock. The principles are language-agnostic; the examples show TypeScript and Java side by side — pick the one matching `docs/agents/stack.md`.

**1. Use dependency injection**

Pass external dependencies in rather than creating them internally:

```typescript
// Easy to mock
function processPayment(order, paymentClient) {
  return paymentClient.charge(order.total);
}

// Hard to mock
function processPayment(order) {
  const client = new StripeClient(process.env.STRIPE_KEY);
  return client.charge(order.total);
}
```

```java
// Easy to mock — constructor-injected, tests pass a Mockito mock or @MockBean
@Service
public class PaymentService {
  private final PaymentClient client;
  public PaymentService(PaymentClient client) { this.client = client; }
  public ChargeResult process(Order order) { return client.charge(order.total()); }
}

// Hard to mock — collaborator built inside the method, reaches into env
public class PaymentService {
  public ChargeResult process(Order order) {
    StripeClient client = new StripeClient(System.getenv("STRIPE_KEY"));
    return client.charge(order.total());
  }
}
```

In Spring, prefer **constructor injection** (above) over field injection (`@Autowired` on a field) — constructor injection is what makes the class trivially unit-testable without booting a context.

**2. Prefer SDK-style interfaces over generic fetchers**

Create specific methods for each external operation instead of one generic function with conditional logic:

```typescript
// GOOD: Each function is independently mockable
const api = {
  getUser: (id) => fetch(`/users/${id}`),
  getOrders: (userId) => fetch(`/users/${userId}/orders`),
  createOrder: (data) => fetch('/orders', { method: 'POST', body: data }),
};

// BAD: Mocking requires conditional logic inside the mock
const api = {
  fetch: (endpoint, options) => fetch(endpoint, options),
};
```

```java
// GOOD: Each method is independently stubbable with Mockito
public interface UserApi {
  User getUser(UserId id);
  List<Order> getOrders(UserId userId);
  Order createOrder(NewOrder data);
}

// BAD: One generic entry point, mocks need conditional logic by path
public interface HttpClient {
  <T> T call(String endpoint, Map<String, Object> options, Class<T> type);
}
```

The SDK approach means:
- Each mock / stub returns one specific shape
- No conditional logic in test setup (no `when(...).thenAnswer(invocation -> switch(endpoint) ...)`)
- Easier to see which endpoints a test exercises
- The compiler enforces shape per endpoint
