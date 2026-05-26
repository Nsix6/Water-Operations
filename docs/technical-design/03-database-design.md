# Database Design

# Overview

The platform will use PostgreSQL as the primary relational database system.

The database design prioritizes:

- Relational integrity
- Transaction consistency
- Auditability
- Scalability
- Workflow enforcement

---

# Core Tables

## users

Stores authentication identities.

Fields:

- id
- email
- phone_number
- password_hash
- role
- is_active
- created_at
- updated_at

---

## customer_profiles

Stores customer-specific information.

Fields:

- id
- user_id
- first_name
- last_name
- gender
- preferred_notification_method

---

## driver_profiles

Stores driver-specific information.

Fields:

- id
- user_id
- employee_id
- working_hours
- status

---

## addresses

Stores delivery addresses.

Fields:

- id
- customer_id
- address_line
- city
- state
- landmark

---

## products

Stores available products.

Fields:

- id
- name
- price
- quantity_unit
- availability_status

---

## orders

Stores customer orders.

Fields:

- id
- customer_id
- order_status
- total_amount
- payment_status
- created_at

---

## order_items

Stores products belonging to orders.

Fields:

- id
- order_id
- product_id
- quantity
- unit_price

---

## payments

Stores payment records.

Fields:

- id
- order_id
- amount
- payment_method
- payment_status
- transaction_reference

---

## delivery_assignments

Stores delivery assignments.

Fields:

- id
- order_id
- driver_id
- assigned_at
- delivery_status

---

## notifications

Stores notification records.

Fields:

- id
- user_id
- notification_type
- message
- delivery_status

---

## audit_logs

Stores audit history.

Fields:

- id
- actor_id
- action
- entity_type
- old_value
- new_value
- timestamp

---

# Relationship Design

- User has one CustomerProfile
- User has one DriverProfile
- CustomerProfile has many Orders
- Order has many OrderItems
- Order has one Payment
- DriverProfile has many DeliveryAssignments

---

# Database Principles

- Use foreign key constraints
- Preserve audit history
- Avoid destructive deletes
- Use timestamps consistently
- Enforce relational integrity
