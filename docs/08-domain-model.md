# Domain Model

# Core Entities

## User

Represents authenticated system identities.

---

## CustomerProfile

Stores customer-specific information.

---

## DriverProfile

Stores driver-specific information.

---

## Address

Stores customer delivery addresses.

---

## Product

Represents water products available for purchase.

---

## Order

Represents customer purchase requests.

---

## OrderItem

Represents individual products within orders.

---

## Payment

Represents payment transactions.

---

## DeliveryAssignment

Represents assignment of deliveries to drivers.

---

## Notification

Represents system notifications.

---

## AuditLog

Represents operational activity history.

---

# Core Relationships

- User has one CustomerProfile
- User has one DriverProfile
- CustomerProfile has many Orders
- Order has many OrderItems
- Order has one Payment
- Order has one DeliveryAssignment
- DriverProfile has many DeliveryAssignments
