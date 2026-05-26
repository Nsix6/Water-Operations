# Workflows

# Customer Ordering Workflow

Customer creates account
→ Customer logs in
→ Customer places order
→ Customer makes payment
→ Payment verified
→ Order enters READY_FOR_DISPATCH
→ Driver assigned
→ Driver delivers order
→ Customer provides OTP
→ Driver submits OTP
→ Order marked DELIVERED
→ Order marked COMPLETED

---

# Order Lifecycle

PENDING_PAYMENT
→ PAID
→ READY_FOR_DISPATCH
→ ASSIGNED
→ OUT_FOR_DELIVERY
→ DELIVERED
→ COMPLETED

Failure states:

- PAYMENT_FAILED
- DELIVERY_FAILED
- CANCELLED
- REFUNDED

---

# Driver Workflow

Driver logs in
→ Views assigned deliveries
→ Accepts assignment
→ Updates delivery progress
→ Receives OTP from customer
→ Submits OTP
→ Completes delivery

---

# Administrative Workflow

Manager logs in
→ Reviews orders
→ Verifies operations
→ Assigns drivers
→ Monitors deliveries
→ Reviews reports
→ Handles disputes
