const { Client } = require('pg');
const { v4: uuidv4 } = require('uuid');

const client = new Client({
  connectionString: 'postgres://username:password@localhost:5432/yourdatabase'
});

client.connect();

const createTables = async () => {
  await client.query('DROP TABLE IF EXISTS reservations');
  await client.query('DROP TABLE IF EXISTS customers');
  await client.query('DROP TABLE IF EXISTS restaurants');
  
  await client.query(`
    CREATE TABLE customers (
      id UUID PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    )
  `);
  
  await client.query(`
    CREATE TABLE restaurants (
      id UUID PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    )
  `);
  
  await client.query(`
    CREATE TABLE reservations (
      id UUID PRIMARY KEY,
      date DATE NOT NULL,
      party_count INTEGER NOT NULL,
      restaurant_id UUID REFERENCES restaurants(id) NOT NULL
    )
  `);
};

const createCustomer = async (name) => {
  const id = uuidv4();
  const result = await client.query(
    'INSERT INTO customers (id, name) VALUES ($1, $2) RETURNING *',
    [id, name]
  );
  return result.rows[0];
};

const createRestaurant = async (name) => {
  const id = uuidv4();
  const result = await client.query(
    'INSERT INTO restaurants (id, name) VALUES ($1, $2) RETURNING *',
    [id, name]
  );
  return result.rows[0];
};

const fetchCustomers = async () => {
  const result = await client.query('SELECT * FROM customers');
  return result.rows;
};

const fetchRestaurants = async () => {
  const result = await client.query('SELECT * FROM restaurants');
  return result.rows;
};

const createReservation = async (date, partyCount, restaurantId) => {
  const id = uuidv4();
  const result = await client.query(
    'INSERT INTO reservations (id, date, party_count, restaurant_id) VALUES ($1, $2, $3, $4) RETURNING *',
    [id, date, partyCount, restaurantId]
  );
  return result.rows[0];
};

const destroyReservation = async (id) => {
  await client.query('DELETE FROM reservations WHERE id = $1', [id]);
};

module.exports = {
  client,
  createTables,
  createCustomer,
  createRestaurant,
  fetchCustomers,
  fetchRestaurants,
  createReservation,
  destroyReservation
};


const fetchReservations = async () => {
    const result = await client.query('SELECT * FROM reservations');
    return result.rows;
  };
  
  module.exports = {
    client,
    createTables,
    createCustomer,
    createRestaurant,
    fetchCustomers,
    fetchRestaurants,
    createReservation,
    destroyReservation,
    fetchReservations
  };
  