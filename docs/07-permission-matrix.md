# Permission Matrix

| Action           | Customer | Driver | Dispatcher | Manager |
| ---------------- | -------- | ------ | ---------- | ------- |
| Create Account   | Yes      | No     | No         | Yes     |
| Login            | Yes      | Yes    | Yes        | Yes     |
| Place Order      | Yes      | No     | No         | Yes     |
| Assign Driver    | No       | No     | Yes        | Yes     |
| View Payment     | Limited  | No     | No         | Yes     |
| Modify Orders    | Limited  | No     | No         | Yes     |
| Confirm Delivery | No       | Yes    | Yes        | Yes     |
| View Reports     | No       | No     | Limited    | Yes     |
| Manage Users     | No       | No     | No         | Yes     |
| View Audit Logs  | No       | No     | No         | Yes     |
