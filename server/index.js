const {
    client,
    createTables,
    createCustomer,
    createRestaurant,
    fetchCustomers,
    fetchRestaurants,
    createReservation,
    destroyReservation
  } = require('./db');
  
  const init = async () => {
    try {
      await createTables();
  
      await createCustomer('Alice Smith');
      await createCustomer('Bob Johnson');
      const customers = await fetchCustomers();
      console.log('Customers:', customers);
  
      await createRestaurant('The Fancy Place');
      await createRestaurant('The Cozy Corner');
      const restaurants = await fetchRestaurants();
      console.log('Restaurants:', restaurants);
  
      const reservation = await createReservation('2024-07-01', 4, restaurants[0].id);
      console.log('Created Reservation:', reservation);
  
      await destroyReservation(reservation.id);
      console.log('Deleted Reservation');
    } catch (error) {
      console.error('Error initializing database:', error);
    } finally {
      await client.end();
    }
  };
  
  init();

  
  const express = require('express');
  const bodyParser = require('body-parser');
  const {
    client,
    createTables,
    createCustomer,
    createRestaurant,
    fetchCustomers,
    fetchRestaurants,
    createReservation,
    destroyReservation,
    fetchReservations
  } = require('./db');
  
  const app = express();
  app.use(bodyParser.json());
  
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
  });
  
  const init = async () => {
    try {
      await createTables();
      console.log('Database initialized');
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  };
  
  app.get('/api/customers', async (req, res) => {
    try {
      const customers = await fetchCustomers();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.get('/api/restaurants', async (req, res) => {
    try {
      const restaurants = await fetchRestaurants();
      res.json(restaurants);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.get('/api/reservations', async (req, res) => {
    try {
      const reservations = await fetchReservations();
      res.json(reservations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.post('/api/customers/:id/reservations', async (req, res) => {
    const { id } = req.params;
    const { restaurant_id, date, party_count } = req.body;
    try {
      const reservation = await createReservation(date, party_count, restaurant_id);
      res.status(201).json(reservation);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.delete('/api/customers/:customer_id/reservations/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await destroyReservation(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    init();
  });
  
  