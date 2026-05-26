# Actors and Roles

# Customer

## Description

Represents individuals or businesses purchasing water products.

## Permissions

- Create account
- Login/logout
- Manage profile
- Place orders
- View order history
- Receive notifications
- Track orders
- Submit complaints

## Restrictions

- Cannot modify completed orders
- Cannot access administrative functions
- Sensitive profile changes require verification

---

# Driver

## Description

Responsible only for delivery execution.

## Permissions

- Login
- View assigned deliveries
- Update delivery status
- Submit delivery OTP confirmation

## Restrictions

- Cannot access payment details
- Cannot modify orders
- Cannot modify pricing
- Cannot view sensitive customer data
- Restricted operational access outside working hours

---

# Manager/Admin

## Description

Responsible for overall operational management.

## Permissions

- Manage customers
- Manage orders
- Assign drivers
- Confirm payments
- Manage permissions
- View reports
- Monitor platform activities

## Restrictions

- Actions must be audited
- Cannot retrieve customer passwords

---

# Dispatcher

## Description

Responsible for delivery coordination and assignment.

## Permissions

- Assign deliveries
- Monitor delivery operations
- View delivery statuses

## Restrictions

- Cannot modify payment records
- Cannot access sensitive customer account controls
