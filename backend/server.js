const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("./db");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


// =========================
// HOME
// =========================

app.get("/", (req, res) => {
  res.send("E-Commerce App is running");
});


// =========================
// TEST DATABASE
// =========================

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      message: "Database connected successfully",
      time: result.rows[0].now
    });
  } catch (error) {
    console.error("Database error:", error.message);

    res.status(500).json({
      message: "Database connection failed",
      error: error.message
    });
  }
});


// =========================
// PRODUCTS
// =========================

app.get("/products", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products ORDER BY id DESC"
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Products API error:", error.message);

    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message
    });
  }
});


// =========================
// REGISTER
// =========================

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // Check existing email
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "Email already registered"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role`,
      [name, email, hashedPassword, "user"]
    );

    res.status(201).json({
      message: "Registration successful",
      user: result.rows[0]
    });

  } catch (error) {
    console.error("Register error:", error.message);

    res.status(500).json({
      message: "Registration failed",
      error: error.message
    });
  }
});


// =========================
// LOGIN TEST
// =========================

app.get("/login", (req, res) => {
  res.send("Login API route exists");
});


// =========================
// LOGIN
// =========================

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    // Find user
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const user = result.rows[0];

    // Compare password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      "ecommerce_secret_key",
      {
        expiresIn: "1d"
      }
    );

    res.json({
      message: "Login successful",
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Login error:", error.message);

    res.status(500).json({
      message: "Login failed",
      error: error.message
    });
  }
});


// =========================
// CREATE ORDER
// =========================

app.post("/orders", async (req, res) => {
  try {
    const { userId, totalAmount } = req.body;

    if (!userId || totalAmount === undefined) {
      return res.status(400).json({
        message: "User ID and total amount are required"
      });
    }

    const result = await pool.query(
      `INSERT INTO orders (user_id, total_amount, status)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [userId, totalAmount, "Pending"]
    );

    res.status(201).json({
      message: "Order placed successfully",
      orderId: result.rows[0].id
    });

  } catch (error) {
    console.error("Order error:", error.message);

    res.status(500).json({
      message: "Order failed",
      error: error.message
    });
  }
});


// =========================
// START SERVER
// =========================
app.get("/orders/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      `SELECT id, total_amount, status, created_at
       FROM orders
       WHERE user_id = $1
       ORDER BY id DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Orders error:", error.message);

    res.status(500).json({
      message: "Failed to fetch orders"
    });
  }
});
app.post("/products", async (req, res) => {
  try {
    const { name, description, price, image, stock } = req.body;

    const result = await pool.query(
      `INSERT INTO products (name, description, price, image_url, stock)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, description, price, image, stock]
    );

    res.status(201).json({
      message: "Product added successfully",
      product: result.rows[0],
    });

  } catch (error) {
    console.error("Add product error:", error.message);

    res.status(500).json({
      message: "Failed to add product",
      error: error.message
    });
  }
});
app.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product deleted successfully",
      product: result.rows[0],
    });
  } catch (error) {
    console.error("Delete product error:", error.message);

    res.status(500).json({
      message: "Failed to delete product",
      error: error.message,
    });
  }
});
app.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image, stock } = req.body;

    const result = await pool.query(
      `UPDATE products
       SET name = $1,
           description = $2,
           price = $3,
           image_url = $4,
           stock = $5
       WHERE id = $6
       RETURNING *`,
      [name, description, price, image, stock, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product updated successfully",
      product: result.rows[0],
    });
  } catch (error) {
    console.error("Update product error:", error.message);

    res.status(500).json({
      message: "Failed to update product",
      error: error.message,
    });
  }
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});