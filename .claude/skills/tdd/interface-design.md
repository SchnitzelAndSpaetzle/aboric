# Interface Design for Testability

Good interfaces make testing natural. The principles below are language-agnostic; the examples show the same pattern in TypeScript and Java so you can pick whichever matches the repo (see `docs/agents/stack.md`).

1. **Accept dependencies, don't create them**

   ```typescript
   // Testable
   function processOrder(order, paymentGateway) {}

   // Hard to test
   function processOrder(order) {
     const gateway = new StripeGateway();
   }
   ```

   ```java
   // Testable — constructor injection, Spring picks the bean, tests pass a fake
   @Service
   public class OrderService {
     private final PaymentGateway paymentGateway;
     public OrderService(PaymentGateway paymentGateway) { this.paymentGateway = paymentGateway; }
     public Result processOrder(Order order) { ... }
   }

   // Hard to test — collaborator built inside the method
   public class OrderService {
     public Result processOrder(Order order) {
       PaymentGateway gateway = new StripeGateway();
       ...
     }
   }
   ```

2. **Return results, don't produce side effects**

   ```typescript
   // Testable
   function calculateDiscount(cart): Discount {}

   // Hard to test
   function applyDiscount(cart): void {
     cart.total -= discount;
   }
   ```

   ```java
   // Testable — pure function, asserts on the return value
   public Discount calculateDiscount(Cart cart) { ... }

   // Hard to test — mutates the argument, must inspect cart state afterwards
   public void applyDiscount(Cart cart) { cart.setTotal(cart.getTotal().subtract(discount)); }
   ```

3. **Small surface area**
   - Fewer methods / public members = fewer tests needed
   - Fewer params = simpler test setup
   - Prefer value objects over primitive obsession — they shrink test setup AND let the type system carry invariants the test would otherwise re-assert
