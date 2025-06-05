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

const PORT = 48488;

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

app.post('/reset', async (req,res) => {
    try {
        // Replace with your actual stored procedure name
        await db.query('CALL ResetSchema()');
        res.redirect('/');    
        // res.status(200).send({ message: 'Database reset successful' });
    } catch (error) {
        console.error('Error calling reset procedure:', error);
        res.status(500).send({ error: 'Failed to reset database' });
    }
})

app.post('/delete_customer', async (req,res) => {
    const {customer_id} = req.body;
    try {
        // Replace with your actual stored procedure name
        await db.query('CALL DeleteCustomer(?)',[customer_id]);
        res.redirect('/customers');    
        // res.status(200).send({ message: 'Customer Deleted' });
    } catch (error) {
        console.error('Error calling Delete Customer procedure:', error);
        res.status(500).send({ error: 'Failed to Delete Customer' });
    }
})

app.post('/create_customer', async (req,res) => {
    const {first_name, middle_name, last_name, phone_number, email, business_name} = req.body;
    try {
        // Replace with your actual stored procedure name
        await db.query('CALL CreateCustomer(?,?,?,?,?,?)',[first_name, middle_name, last_name, phone_number, email, business_name]);
        res.redirect('/customers');    
        // res.status(200).send({ message: 'Customer Added' });
    } catch (error) {
        console.error('Error calling Create Customer procedure:', error);
        res.status(500).send({ error: 'Failed to Add Customer' });
    }
})

app.get('/update_customer', async (req,res)  => {
    const customer_id = req.query.update_customer_id;
    const customer = await db.query('CALL ReadCustomer(?)', [customer_id]);
    console.log(customer[0][0][0]);
    res.render('update_customer', {customer: customer[0][0][0]});
});

app.post('/update_customer', async (req,res)  => {
    const {customer_id, first_name, middle_name, last_name, phone_number, email, business_name} = req.body;
    console.log(req.body);
    try {
        // Replace with your actual stored procedure name
        await db.query('CALL UpdateCustomer(?,?,?,?,?,?,?)',[customer_id, first_name, middle_name, last_name, phone_number, email, business_name]);
        res.redirect('/customers');    
        // res.status(200).send({ message: 'Customer Updated' });
    } catch (error) {
        console.error('Error calling Update Customer procedure:', error);
        res.status(500).send({ error: 'Failed to Update Customer' });
    }
});

app.post('/delete_customer_account', async (req,res) => {
    const {customer_account_id} = req.body;
    try {
        // Replace with your actual stored procedure name
        await db.query('CALL DeleteCustomerAccount(?)',[customer_account_id]);
        res.redirect('/customers_accounts');    
        // res.status(200).send({ message: 'Customer Account Deleted' });
    } catch (error) {
        console.error('Error calling Delete Customer procedure:', error);
        res.status(500).send({ error: 'Failed to Delete Customer Account' });
    }
})

app.post('/update_customer_account', async (req,res) => {
    const {customer_account_id, first_name, last_name, phone_number, account_number, role} = req.body;
    console.log(req.body);
    try {
        // Replace with your actual stored procedure name
        await db.query('CALL UpdateCustomerAccount(?,?,?,?,?,?)',[first_name, last_name, phone_number, account_number, role, customer_account_id]);
        res.redirect('/customers_accounts');    
        // res.status(200).send({ message: 'Customer Account Updated' });
    } catch (error) {
        console.error('Error calling Update Customer procedure:', error);

        // 1. Trigger violation: only one primary per account
        if (error.code === 'ER_SIGNAL_EXCEPTION' && error.sqlMessage.includes("Only one primary holder")) {
            return res.status(400).json({
                error: "Only one primary holder is allowed per account. Please choose 'secondary' or use a different account."
            });
        }

        // 2. Foreign key constraint errors
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            if (error.sqlMessage.includes('fk_customers_has_accounts_accounts1')) {
                return res.status(400).json({
                    error: "Invalid account number. The account must exist before linking a customer."
                });
            }
            if (error.sqlMessage.includes('fk_customers_has_accounts_customers1')) {
                return res.status(400).json({
                    error: "Invalid customer. The customer must exist before linking an account."
                });
            }
        }

        // 3. NULL value errors (bad or missing data)
        if (error.code === 'ER_BAD_NULL_ERROR') {
            if (error.sqlMessage.includes("account_id")) {
                return res.status(400).json({
                    error: "Invalid account number. The account must exist before linking a customer."
                });
            }
            if (error.sqlMessage.includes("customer_id")) {
                return res.status(400).json({
                    error: "Invalid customer. The customer must exist before linking an account."
                });
            }
            return res.status(400).json({
                error: "Missing required field. Please verify the input data."
            });
        }

        // 4. Catch-all error response
        return res.status(500).json({
            error: "An unexpected error occurred while updating the customer account."
        });
    }
})

app.post('/create_customer_account', async (req,res) => {
    const {first_name, last_name, phone_number, account_number, role} = req.body;
    console.log(req.body);
    try {
        // Replace with your actual stored procedure name
        await db.query('CALL CreateCustomerAccount(?,?,?,?,?)',[first_name, last_name, phone_number, account_number, role]);
        res.redirect('/customers_accounts');    
        // res.status(200).send({ message: 'Customer Account Created' });
    } catch (error) {
        console.error("Error calling Create Customer procedure:", error);

        if (error.code === 'ER_SIGNAL_EXCEPTION' && error.sqlMessage.includes("Only one primary holder")) {
            res.status(400).json({
            error: "Only one primary holder is allowed per account. Please choose 'secondary' or use a different account."
            });

        } else if (error.code === 'ER_BAD_NULL_ERROR') {
            if (error.sqlMessage.includes("account_id")) {
            res.status(400).json({
                error: "Invalid account number. The account must exist before linking a customer."
            });
            } else if (error.sqlMessage.includes("customer_id")) {
            res.status(400).json({
                error: "Invalid customer. The customer must exist before linking an account."
            });
            } else {
            res.status(400).json({ error: "Missing required field. Please verify the data." });
            }

        } else {
            // General fallback error
            res.status(500).json({
            error: "An unexpected error occurred while creating the customer account."
            });
        }
    }
})


 

// ########################################
// ########## LISTENER

app.listen(PORT, function () {
    console.log(
        'Express started on http://classwork.engr.oregonstate.edu:' +
            PORT +
            '; press Ctrl-C to terminate.'
    );
});