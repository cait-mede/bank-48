DROP PROCEDURE IF EXISTS DeleteCustomer;
DROP PROCEDURE IF EXISTS DeleteCustomerAccount;
DROP PROCEDURE IF EXISTS CreateCustomer;
DROP PROCEDURE IF EXISTS UpdateCustomerAccount;
DROP PROCEDURE IF EXISTS CreateCustomerAccount;
DROP PROCEDURE IF EXISTS ReadCustomer;
DROP PROCEDURE IF EXISTS UpdateCustomer;
DELIMITER //

-- Delete Customer Procedure

CREATE PROCEDURE DeleteCustomer(
    in p_customer_id int
)
BEGIN
    DELETE FROM Customers WHERE customer_id = p_customer_id;
END//

CREATE PROCEDURE ReadCustomer(
    in p_customer_id int
)
BEGIN
    SELECT * FROM Customers WHERE customer_id = p_customer_id;
END//

CREATE PROCEDURE UpdateCustomer(
    in p_customer_id int,
    in p_first_name varchar(45),
    in p_middle_name varchar(45),
    in p_last_name varchar(45),
    in p_phone_number varchar(45),
    in p_email varchar(45),
    in p_business_name varchar(45)
)
BEGIN
    UPDATE Customers
    SET
    first_name = p_first_name,
    middle_name = p_middle_name,
    last_name = p_last_name,
    phone_number = p_phone_number,
    email = p_email,
    business_name = p_business_name 
    WHERE customer_id = p_customer_id;
END//

CREATE PROCEDURE CreateCustomer(
    in p_first_name varchar(45),
    in p_middle_name varchar(45),
    in p_last_name varchar(45),
    in p_phone_number varchar(45),
    in p_email varchar(45),
    in p_business_name varchar(45)
)
BEGIN
    INSERT INTO `Customers` (first_name, middle_name, last_name, phone_number, email, business_name)
    VALUES 
    (p_first_name, p_middle_name, p_last_name, p_phone_number, p_email, p_business_name);
END//


CREATE PROCEDURE DeleteCustomerAccount(
    in p_customer_account_id int
)
BEGIN
    DELETE FROM Customers_Accounts WHERE customer_account_id = p_customer_account_id;
END//

CREATE PROCEDURE UpdateCustomerAccount(
    in p_customer_id int,
    in p_account_number varchar(12),
    in p_role varchar(45),
    in p_customer_account_id int
)
BEGIN
    UPDATE Customers_Accounts
    SET 
    customer_id = p_customer_id,
    account_id = (SELECT account_id FROM Accounts WHERE account_number = p_account_number),
    role = p_role   
    WHERE customer_account_id = p_customer_account_id;
END//

CREATE PROCEDURE CreateCustomerAccount(
    in p_customer_id int,
    in p_account_number varchar(12),
    in p_role varchar(45)
)
BEGIN
    INSERT INTO `Customers_Accounts` (customer_id, account_id, role)
    VALUES
    (
    p_customer_id, 
    (SELECT account_id FROM Accounts WHERE account_number = p_account_number),
    p_role
    );
END//






DELIMITER ;