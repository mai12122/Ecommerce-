# Project Documentation: Ecommerce Platform

---

## 1. The Big Picture & Requirements

### The Problem & Value

**Problem:** Small businesses lack an easy-to-use online platform to sell products and manage orders.

**Target Users:** Shop owners (admins) and customers seeking a simple ecommerce experience.

**Business Value:** Enables digital sales, inventory management, and customer engagement for local businesses.

---

### Scope & MVP

**MVP Features:**
- User registration / login
- Product browsing and search by category
- Shopping cart (add, update, remove items)
- Checkout and order placement
- Order history
- Admin product and category management

**Jobs to Be Done:**
- As a customer, I want to browse and search products.
- As a customer, I want to add products to my cart and checkout.
- As an admin, I want to manage products and view orders.

**User Stories & Acceptance Criteria:**

| User Story | Acceptance Criteria |
|---|---|
| As a user, I can register and log in. | Registration and login forms work; errors are handled. |
| As a user, I can add/remove products from my cart. | Cart updates in real time. |
| As a user, I can view my order history. | Orders are listed with item details and totals. |
| As an admin, I can add/edit/delete products. | Changes reflect immediately in the product list. |
| As a visitor, I can browse products by category. | Products are listed and filterable by category. |

---

### Requirements

**Functional:**
- User authentication (register, login, profile management)
- Product CRUD (admin dashboard via Django Admin)
- Category management
- Shopping cart (add, update quantity, remove items)
- Order placement and order history
- Admin dashboard for product and order management

**Non-Functional:**
- Responsive UI (React SPA)
- Secure authentication (Django session / JWT)
- Data consistency (relational DB with FK constraints)
- Target: < 2 s page load
- Dockerized deployment for reproducibility

---

## 2. User Experience & Flow

### Journeys & Information Architecture

**Customer Journey:**
```
Home → Shop / Browse Products → Product Details → Add to Cart → Checkout → Order Confirmation → Order History
```

**Admin Journey:**
```
Django Admin Login → Manage Categories → Add / Edit / Delete Products → View Orders
```

**App Organisation (Frontend Pages):**

| Page | Route | Description |
|---|---|---|
| Home / Shop | `/` | Product listing with category filter |
| Product Details | `/product/:id` | Individual product view |
| Cart | `/cart` | Shopping cart management |
| Checkout | `/checkout` | Order placement form |
| Sign In | `/signin` | User login |
| Sign Up | `/signup` | User registration |
| Profile | `/profile` | User profile management |
| Wishlist | `/wishlist` | Saved / wishlist products |
| Order History | `/orders` | Past orders |
| Django Admin | `/admin/` | Admin product and order management |

---

### The Prototype

**Wireframes / Prototype:**
> [Insert Figma / Adobe XD link or screenshots here]

Key screens:
- Product listing grid with category sidebar
- Product detail page with add-to-cart button
- Cart sidebar / page with quantity controls
- Checkout form (name, address, phone, payment method)
- Order confirmation page

---

## 3. Architecture & Logic

### System Basics

**Infrastructure:**

| Layer | Technology |
|---|---|
| Frontend | React (Vite) — Single Page Application |
| Backend | Django REST Framework — REST API |
| Database | PostgreSQL 16 — Relational database |
| Containerisation | Docker Compose (multi-container: `db`, `backend`, `frontend`) |
| Media Storage | Local filesystem (`/backend/media/products/`) |

**Service Ports:**

| Service | Port |
|---|---|
| Frontend | `5173` |
| Backend API | `8000` |
| PostgreSQL | `5432` |
| Django Admin | `8000/admin/` |

---

### Diagrams

**Sequence Diagram — User Places an Order:**
```
Browser → POST /api/checkout/
         → Django view: create_orders()
           → Cart.objects.first()              (fetch cart)
           → Order.objects.create(...)         (create order)
           → OrderItem.objects.create(...) × N (create items)
           → cart.items.all().delete()         (clear cart)
         ← { order_id, message }
Browser ← Order Confirmation Page
```

**Sequence Diagram — Add to Cart:**
```
Browser → POST /api/cart/add/
         → Django view: add_to_cart()
           → Product.objects.get(id)
           → Cart.objects.get_or_create(user=None)
           → CartItem.objects.get_or_create(cart, product)
           → item.quantity += 1 (if exists)
         ← { message, cart }
Browser ← Cart updated in real time
```

**State Diagram — Order Lifecycle:**
```
[Cart] → (Checkout submitted) → [Order Created]
                                     ↓
                              [Items Recorded]
                                     ↓
                              [Cart Cleared]
                                     ↓
                              [Order Visible in History]
```

**State Diagram — Cart:**
```
[Empty Cart] → (Add item) → [Cart with Items]
                                ↓
               (Update qty)  [Updated Cart]
                                ↓
               (Remove item / qty = 0)  [Item Removed]
                                ↓
               (Checkout) → [Cart Cleared]
```

---

## 4. Data Modeling & DB Design

### ERD / EER Diagrams

**Entities:** `User`, `UserProfile`, `Category`, `Product`, `Cart`, `CartItem`, `Order`, `OrderItem`

**Relationships:**

| Relationship | Type |
|---|---|
| User — UserProfile | 1-to-1 |
| Category — Product | 1-to-N |
| User — Order | 1-to-N |
| Order — OrderItem | 1-to-N |
| User — Cart | 1-to-N |
| Cart — CartItem | 1-to-N |
| Product — CartItem | N-to-1 (FK) |
| Product — OrderItem | N-to-1 (FK) |

> [Attach or link to ERD / EER diagram here]

---

### Schemas & Normalization

**Schemas** (derived from `backend/store/models.py`):

**Category**
```
id          SERIAL PRIMARY KEY
name        VARCHAR(100) UNIQUE NOT NULL
slug        VARCHAR UNIQUE NOT NULL
```

**Product**
```
id          SERIAL PRIMARY KEY
category_id INTEGER REFERENCES category(id) ON DELETE CASCADE
name        VARCHAR(200) NOT NULL
description TEXT
price       DECIMAL(10, 2) NOT NULL
image       VARCHAR (file path, nullable)
created_at  TIMESTAMP DEFAULT NOW()
```

**UserProfile**
```
id           SERIAL PRIMARY KEY
user_id      INTEGER REFERENCES auth_user(id) ON DELETE CASCADE UNIQUE
address      VARCHAR(255)
phone_number VARCHAR(20)
```

**Order**
```
id           SERIAL PRIMARY KEY
user_id      INTEGER REFERENCES auth_user(id) ON DELETE CASCADE (nullable)
created_at   TIMESTAMP DEFAULT NOW()
total_amount DECIMAL(10, 2) NOT NULL
```

**OrderItem**
```
id         SERIAL PRIMARY KEY
order_id   INTEGER REFERENCES store_order(id) ON DELETE CASCADE
product_id INTEGER REFERENCES store_product(id) ON DELETE CASCADE
quantity   INTEGER NOT NULL
price      DECIMAL(10, 2) NOT NULL
```

**Cart**
```
id         SERIAL PRIMARY KEY
user_id    INTEGER REFERENCES auth_user(id) ON DELETE CASCADE (nullable)
created_at TIMESTAMP DEFAULT NOW()
```

**CartItem**
```
id         SERIAL PRIMARY KEY
cart_id    INTEGER REFERENCES store_cart(id) ON DELETE CASCADE
product_id INTEGER REFERENCES store_product(id) ON DELETE CASCADE
quantity   INTEGER DEFAULT 1 NOT NULL
```

**Normalization:**
Tables are normalized to Third Normal Form (3NF):
- Separate tables for `Category`, `Product`, `Order`, `OrderItem`, `Cart`, `CartItem`, and `UserProfile`.
- No repeating groups; all non-key attributes depend only on the primary key.
- No transitive dependencies.

**Denormalization:**
None applied in MVP. Can denormalize (e.g., cache `order_total` or `product_name` in `OrderItem`) for reporting / performance if required.

---

## 5. DB Implementation & Optimization

### Key SQL Queries

**List products by category:**
```sql
SELECT * FROM store_product WHERE category_id = %s;
```

**User order history:**
```sql
SELECT * FROM store_order WHERE user_id = %s ORDER BY id DESC;
```

**Order details with items:**
```sql
SELECT o.id, oi.product_id, oi.quantity, oi.price
FROM store_order o
JOIN store_orderitem oi ON o.id = oi.order_id
WHERE o.user_id = %s;
```

**Cart contents for a user:**
```sql
SELECT ci.id, ci.quantity, p.name, p.price
FROM store_cartitem ci
JOIN store_product p ON ci.product_id = p.id
JOIN store_cart c ON ci.cart_id = c.id
WHERE c.user_id = %s;
```

### Optimization Notes
- Django ORM generates parameterised queries; no raw SQL injection risk.
- Use `select_related` / `prefetch_related` for cart and order item queries to avoid N+1 problems.
- Index `category_id` on `store_product` for fast category filtering.
- Index `user_id` on `store_order` and `store_cart` for fast user-specific lookups.

---

## 6. QA & Post-Launch

### Testing

**QA Plan:**
- **Unit tests:** Django `TestCase` for models and views (`backend/store/tests.py`).
- **Integration tests:** DRF `APIClient` tests for all REST endpoints.
- **Manual UI testing:** Browser-based testing of all user flows.
- **CI/CD pipeline:** GitHub Actions for automated test runs on each push.

### Metrics / KPIs

| KPI | Description |
|---|---|
| User Registrations | Number of new user accounts created |
| Conversion Rate | % of visitors who complete a purchase |
| Order Volume | Total number of orders placed |
| Average Order Value | Mean `total_amount` across all orders |
| System Uptime | % availability of the backend service |
| Page Load Time | Target < 2 seconds for product listing |

---

## Product Requirement Document (PRD)

### 1. User Stories & Acceptance Criteria

| # | User Story | Acceptance Criteria |
|---|---|---|
| 1 | As a visitor, I want to browse products by category so I can find what I need. | Products are listed and filterable by category; filter updates the list without page reload. |
| 2 | As a user, I want to register, log in, and manage my profile. | Registration, login, and profile update forms work; errors are handled gracefully. |
| 3 | As a user, I want to add products to my cart and checkout. | Cart updates in real time; checkout creates an order and clears the cart. |
| 4 | As an admin, I want to add, edit, and delete products and categories. | Django Admin allows full CRUD; changes reflect immediately in the product list. |
| 5 | As a user, I want to view my order history. | All past orders are listed with item details and total amounts. |

### 2. System Architecture

| Component | Technology | Role |
|---|---|---|
| Frontend | React (Vite) SPA | UI, routing, state management |
| Backend | Django REST Framework | REST API, business logic, auth |
| Database | PostgreSQL 16 | Persistent relational data storage |
| Cache (optional) | Redis | Session caching, query result caching |
| Deployment | Docker Compose | Multi-container orchestration |
| Authentication | Django session-based auth | User login / registration |

### 3. UML Diagrams

**Class Diagram:**
> See entity definitions in `backend/store/models.py`

Key classes: `Category`, `Product`, `UserProfile`, `Order`, `OrderItem`, `Cart`, `CartItem`

**Sequence Diagram:**
> User places order → `POST /api/checkout/` → Django creates Order + OrderItems → Cart cleared → Confirmation response

**State Diagram:**
> Cart states: Empty → Has Items → Checkout → Cleared  
> Order states: Created → Items Recorded → Confirmed

---

## Database Design Document

### 1. ERD / EER Diagrams

**Entities:**
`User` (Django built-in), `UserProfile`, `Category`, `Product`, `Cart`, `CartItem`, `Order`, `OrderItem`

**Relationships:**

```
User ──1────1── UserProfile
Category ──1────N── Product
User ──1────N── Order
Order ──1────N── OrderItem
OrderItem ──N────1── Product
User ──1────N── Cart
Cart ──1────N── CartItem
CartItem ──N────1── Product
```

> [Attach or link to ERD / EER diagram here]

### 2. Schemas

| Table | Key Columns |
|---|---|
| `store_category` | `id`, `name`, `slug` |
| `store_product` | `id`, `category_id`, `name`, `description`, `price`, `image`, `created_at` |
| `auth_user` | `id`, `username`, `email`, `password` (Django built-in) |
| `store_userprofile` | `id`, `user_id`, `address`, `phone_number` |
| `store_order` | `id`, `user_id`, `created_at`, `total_amount` |
| `store_orderitem` | `id`, `order_id`, `product_id`, `quantity`, `price` |
| `store_cart` | `id`, `user_id`, `created_at` |
| `store_cartitem` | `id`, `cart_id`, `product_id`, `quantity` |

---

## 7. Delivery & Q&A Defense

### The Pitch

**Presentation:**
- All team members present; each covers their section.
- Clear slides with demo of the live app.
- Time managed to ≤ 30 minutes including Q&A.

**Demo Flow:**
1. Register a new user account.
2. Browse products by category.
3. Add items to the cart and update quantities.
4. Complete checkout and view the order confirmation.
5. View order history.
6. Show Django Admin: add/edit/delete a product.

### Defending Your Choices

| Decision | Rationale |
|---|---|
| **Django REST Framework** | Rapid backend development, built-in admin, ORM, auth, and serializers. |
| **React + Vite** | Modern component-based UI, fast HMR, easy state management with Context API. |
| **PostgreSQL** | Reliable relational DB suited to e-commerce data with FK constraints and ACID compliance. |
| **Docker Compose** | Reproducible multi-container environment; matches dev and production parity. |
| **Session-based Auth** | Simpler for MVP; can be upgraded to JWT for stateless scaling later. |

---

*Document prepared for FESE304 / FESE305 project assessment.*
