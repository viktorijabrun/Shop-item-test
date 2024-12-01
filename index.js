const express = require("express");
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// In-memory data storage
let items = [];

// Get all items
app.get("/items", (req, res) => {
  res.json(items);
});

// Get a single item by ID
app.get("/items/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const item = items.find((item) => item.id === id);
  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ message: "Item not found" });
  }
});

// Create a new item
app.post("/items", (req, res) => {
  const { name, price, description } = req.body;
  if (!name || !price) {
    return res.status(400).json({ message: "Name and price are required" });
  }

  const newItem = {
    id: items.length ? items[items.length - 1].id + 1 : 1, // Auto-increment ID
    name,
    price,
    description: description || "No description provided",
  };

  items.push(newItem);
  res.status(201).json(newItem);
});

// Update an item by ID
app.put("/items/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { name, price, description } = req.body;
  const itemIndex = items.findIndex((item) => item.id === id);

  if (itemIndex === -1) {
    return res.status(404).json({ message: "Item not found" });
  }

  const updatedItem = {
    ...items[itemIndex],
    name: name || items[itemIndex].name,
    price: price || items[itemIndex].price,
    description: description || items[itemIndex].description,
  };

  items[itemIndex] = updatedItem;
  res.json(updatedItem);
});

// Delete an item by ID
app.delete("/items/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const itemIndex = items.findIndex((item) => item.id === id);

  if (itemIndex === -1) {
    return res.status(404).json({ message: "Item not found" });
  }

  items.splice(itemIndex, 1);
  res.status(204).send();
});

// Start the server
app.listen(port, () => {
  console.log(`Shop Items API running at http://localhost:${port}`);
});
