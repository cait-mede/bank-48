// ########################################
// ########## SETUP

// Citation for the following file:// Date: 05/07/2025
// Adapted from: Activity 2 - Connect webapp to database
// Source URL: https://canvas.oregonstate.edu/courses/1999601/assignments/10006370

// Express
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const PORT = 48484;

// Database
const db = require('./database/db-connector');

// Handlebars
const { engine } = require('express-handlebars'); // Import express-handlebars engine
app.engine('.hbs', engine({ extname: '.hbs' })); // Create instance of handlebars
app.set('view engine', '.hbs'); // Use handlebars engine for *.hbs files.

// ########################################
// ########## ROUTE HANDLERS

// READ ROUTES
app.get('/', async function (req, res) {
    try {
        res.render('home'); // Render the home.hbs file
    } catch (error) {
        console.error('Error rendering page:', error);
        // Send a generic error message to the browser
        res.status(500).send('An error occurred while rendering the page.');
    }
});

app.get('/customers', async function (req, res) {
    try {
 
        const query1 = 'SELECT * FROM Customers;';
        const [customers] = await db.query(query1);
        res.render('customers', { people: customers});
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.get('/accounts', async function (req, res) {
    try {
 
        const query1 = 'SELECT a.account_id, at.account_type, a.balance, a.account_number FROM Accounts a \
                        JOIN Account_Types at ON a.account_type_id = at.account_type_id;';
        const [accounts] = await db.query(query1);
        const query2 = 'SELECT * FROM Account_Types';
        const [account_types] = await db.query(query2);
        res.render('accounts', { accounts: accounts, account_types: account_types});
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.get('/account_types', async function (req, res) {
    try {
 
        const query1 = 'SELECT * FROM Account_Types;';
        const [account_types] = await db.query(query1);
        res.render('account_types', { types: account_types});
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});
 
app.get('/transaction_types', async function (req, res) {
    try {
 
        const query1 = 'SELECT * FROM Transaction_Types;';
        const [transaction_types] = await db.query(query1);
        res.render('transaction_types', { types: transaction_types});
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});
 
app.get('/transactions', async function (req, res) {
    try {
 
        const query1 = 'SELECT * FROM Transaction_Types;';
        const [transaction_types] = await db.query(query1);
        const query2 = 'SELECT t.transaction_id, tt.transaction_type, \
                        oa.account_number AS origin_account_number, \
                        da.account_number AS destination_account_number, \
                        t.amount \
                        FROM Transactions t \
                        JOIN Transaction_Types tt ON t.transaction_type_id = tt.transaction_type_id \
                        LEFT JOIN Accounts oa ON t.origin_account_id = oa.account_id \
                        LEFT JOIN Accounts da ON t.destination_account_id = da.account_id;'
        const [transactions] = await db.query(query2);
        res.render('transactions', {transactions: transactions, types: transaction_types});
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.get('/customers_accounts', async function (req, res) {
    try {
 
        const query1 = 'SELECT ca.customer_account_id, CONCAT(c.first_name, " ", c.last_name) AS customer_name, a.account_number, ca.role \
                        FROM Customers_Accounts ca \
                        JOIN Customers c ON c.customer_id = ca.customer_id \
                        JOIN Accounts a ON a.account_id = ca.account_id;'
                        
        const [customers_accounts] = await db.query(query1);
        res.render('customers_accounts', { customers_accounts: customers_accounts});
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});
 

// ########################################
// ########## LISTENER

app.listen(PORT, function () {
    console.log(
        'Express started on http://classwork.engr.oregonstate.edu:' +
            PORT +
            '; press Ctrl-C to terminate.'
    );
});