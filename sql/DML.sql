--------------------------
-- Accounts 
--------------------------

SELECT * FROM Accounts;

INSERT INTO `Accounts` (account_type_id, balance)
VALUES
(@account_type_id, @balance);

DELETE FROM `Accounts` WHERE account_id = @account_id;

--------------------------
-- Customers
--------------------------
SELECT * FROM Customers;

INSERT INTO `Customers` (first_name, last_name, middle_name, phone_number, business_name, email)
VALUES 
(@first_name, @last_name, @middle_name, @phone_number, @business_name, @email);

UPDATE Customers
SET first_name = @first_name,
    last_name = @last_name,
    middle_name = @middle_name,
    phone_number = @phone_number,
    business_name = @business_name,
    email = @email
WHERE customer_id = @customer_id;


DELETE FROM Customers WHERE customer_id = @customer_id;


--------------------------
-- Customers_Accounts 
--------------------------

SELECT ca.customer_account_id, CONCAT(c.first_name, " ", c.last_name) AS customer_name, a.account_number, ca.role 
FROM Customers_Accounts ca 
JOIN Customers c ON c.customer_id = ca.customer_id 
JOIN Accounts a ON a.account_id = ca.account_id;

INSERT INTO `Customers_Accounts` (customer_id, account_id, role)
VALUES
(
    (SELECT customer_id FROM Customers WHERE first_name = @first_name, last_name = @last_name, middle_name = @middle_name, phone_number = @phone_number), 
    (SELECT account_id FROM Accounts WHERE account_number = @account_number),
    @role
);

UPDATE Customers_Accounts
SET customer_id = (SELECT customer_id FROM Customers WHERE first_name = @first_name, last_name = @last_name, middle_name = @middle_name, phone_number = @phone_number),
    account_id = (SELECT account_id FROM Accounts WHERE account_number = @account_number),
    role = @role
WHERE customer_account_id = @customer_account_id;

DELETE FROM Customers_Accounts WHERE customer_account_id = @customer_account_id;

--------------------------
-- Transactions
--------------------------

SELECT t.transaction_id, tt.transaction_type, 
oa.account_number AS origin_account_number, 
da.account_number AS destination_account_number, 
t.amount 
FROM Transactions t 
JOIN Transaction_Types tt ON t.transaction_type_id = tt.transaction_type_id \
LEFT JOIN Accounts oa ON t.origin_account_id = oa.account_id 
LEFT JOIN Accounts da ON t.destination_account_id = da.account_id;

INSERT INTO `Transactions`(transaction_type_id, destination_account_id, origin_account_id, amount)
VALUES
(@transaction_type_id, @destination_account_id, @origin_account_id, @amount);

--------------------------
-- Account_Types
--------------------------
SELECT account_type FROM Account_Types;

--------------------------
-- Transaction_Types
--------------------------
SELECT transaction_type FROM Transaction_Types;