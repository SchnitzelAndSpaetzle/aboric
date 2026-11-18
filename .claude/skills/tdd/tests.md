# Good and Bad Tests

Examples appear in both TypeScript (Vitest/Jest style) and Java (JUnit 5 + Mockito style). Pick the one matching `docs/agents/stack.md`; the principles are identical.

## Good Tests

**Integration-style**: Test through real interfaces, not mocks of internal parts.

```typescript
// GOOD: Tests observable behavior
test("user can checkout with valid cart", async () => {
  const cart = createCart();
  cart.add(product);
  const result = await checkout(cart, paymentMethod);
  expect(result.status).toBe("confirmed");
});
```

```java
// GOOD: Tests observable behaviour through the public API
@Test
void userCanCheckoutWithValidCart() {
  Cart cart = Cart.empty();
  cart.add(product);
  CheckoutResult result = checkoutService.checkout(cart, paymentMethod);
  assertThat(result.status()).isEqualTo(Status.CONFIRMED);
}
```

Characteristics:

- Tests behavior users/callers care about
- Uses public API only
- Survives internal refactors
- Describes WHAT, not HOW
- One logical assertion per test

## Bad Tests

**Implementation-detail tests**: Coupled to internal structure.

```typescript
// BAD: Tests implementation details
test("checkout calls paymentService.process", async () => {
  const mockPayment = jest.mock(paymentService);
  await checkout(cart, payment);
  expect(mockPayment.process).toHaveBeenCalledWith(cart.total);
});
```

```java
// BAD: Asserts on internal interactions, not behaviour
@Test
void checkoutCallsPaymentServiceProcess() {
  PaymentService payment = mock(PaymentService.class);
  CheckoutService checkout = new CheckoutService(payment);
  checkout.checkout(cart, paymentMethod);
  verify(payment).process(cart.total());  // breaks the moment process() is renamed
}
```

Red flags:

- Mocking internal collaborators
- Testing private methods
- Asserting on call counts/order
- Test breaks when refactoring without behavior change
- Test name describes HOW not WHAT
- Verifying through external means instead of interface

```typescript
// BAD: Bypasses interface to verify
test("createUser saves to database", async () => {
  await createUser({ name: "Alice" });
  const row = await db.query("SELECT * FROM users WHERE name = ?", ["Alice"]);
  expect(row).toBeDefined();
});

// GOOD: Verifies through interface
test("createUser makes user retrievable", async () => {
  const user = await createUser({ name: "Alice" });
  const retrieved = await getUser(user.id);
  expect(retrieved.name).toBe("Alice");
});
```

```java
// BAD: Bypasses the repository's interface to assert
@Test
void createUserSavesToDatabase() {
  userService.createUser(new NewUser("Alice"));
  Integer count = jdbcTemplate.queryForObject(
      "SELECT count(*) FROM users WHERE name = ?", Integer.class, "Alice");
  assertThat(count).isEqualTo(1);
}

// GOOD: Verifies through the same interface the production code uses
@Test
void createUserMakesUserRetrievable() {
  User created = userService.createUser(new NewUser("Alice"));
  User retrieved = userService.getUser(created.id());
  assertThat(retrieved.name()).isEqualTo("Alice");
}
```
