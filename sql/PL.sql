DROP PROCEDURE IF EXISTS ResetSchema;
DROP PROCEDURE IF EXISTS DeleteCustomer;
DELIMITER //

CREATE PROCEDURE ResetSchema()
BEGIN

    SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
    SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
    SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

    TRUNCATE Table Customers;
    TRUNCATE Table Accounts;
    TRUNCATE Table Transactions;
    TRUNCATE Table Transaction_Types;
    TRUNCATE Table Account_Types;
    TRUNCATE Table Customers_Accounts;


    -- -----------------------------------------------------
    -- Sample Data - Account Type (Category) 
    -- -----------------------------------------------------

    INSERT INTO `Account_Types` (`account_type`) VALUES
    ('Checking'),
    ('Savings'),
    ('High Yield Savings');

    -- -----------------------------------------------------
    -- Sample Data - Transaction Type (Category) 
    -- -----------------------------------------------------

    INSERT INTO `Transaction_Types` (`transaction_type`) VALUES
    ('Withdrawal'),
    ('Deposit'),
    ('Transfer');

    -- -----------------------------------------------------
    -- Sample Data - Customers
    -- Citation for use of AI Tools:
    -- Date: 05/07/2025
    -- Prompts used to generate SQL for data entries into customers table. 
    -- can you give me an example of a list of customers with the attributes first_name, last_name,
    -- middle_name, phone_number, business_name, and email? business_name and middle_name can be null. 
    -- AI Source URL: https://chatgpt.com/
    -- -----------------------------------------------------

    INSERT INTO `Customers` (first_name, last_name, middle_name, phone_number, business_name, email)
    VALUES 
    ('Alice', 'Smith', 'Marie', '555-123-4567', 'Alice Co.', 'alice.smith@example.com'),
    ('Bob', 'Johnson', NULL, '555-234-5678', NULL, 'bob.johnson@example.com'),
    ('Charlie', 'Brown', 'Lee', '555-345-6789', 'Charlie Designs', 'charlie.brown@example.com'),
    ('Diana', 'Prince', NULL, '555-456-7890', 'Wonder Boutique', 'diana.prince@example.com'),
    ('Evan', 'Wright', 'James', '555-567-8901', NULL, 'evan.wright@example.com'),
    ('Fiona', 'Garcia', 'Rose', '555-678-9012', 'Fiona Foods', 'fiona.garcia@example.com'),
    ('George', 'Martinez', NULL, '555-789-0123', NULL, 'george.martinez@example.com'),
    ('Hannah', 'Lee', 'Grace', '555-890-1234', 'Hannah Art', 'hannah.lee@example.com'),
    ('Ian', 'Nguyen', NULL, '555-901-2345', NULL, 'ian.nguyen@example.com'),
    ('Julia', 'Kim', 'Ann', '555-012-3456', 'Julia Consulting', 'julia.kim@example.com');

    -- -----------------------------------------------------
    -- Sample Data - Accounts 
    -- -----------------------------------------------------

    INSERT INTO `Accounts` (account_type_id, balance)
    VALUES
    (1, 1500.00),
    (2, 2300.50),
    (1, 750.75),
    (3, 12000.00),
    (2, 50.25);

    -- -----------------------------------------------------
    -- Sample Data - Customers_Accounts 
    -- -----------------------------------------------------

    INSERT INTO `Customers_Accounts`(customer_id, account_id, role)
    VALUES
    (1, 1, 'primary'),
    (2, 2, 'primary'),
    (3, 3, 'primary'),
    (4, 4, 'primary'),
    (5, 5, 'primary'),
    (6, 1, 'secondary');

    -- -----------------------------------------------------
    -- Sample Data - Transactions 
    -- (** Note that this INSERT will trigger changes to 
    --     the Accounts table for balance changes **) 
    -- -----------------------------------------------------

    INSERT INTO `Transactions`(transaction_type_id, destination_account_id, origin_account_id, amount)
    VALUES
    (1, null, 1, 100.00),
    (2, 2, null, 500.00),
    (3, 5, 4, 1000.00);

    SET SQL_MODE=@OLD_SQL_MODE;
    SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
    SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
END
//



-- Delete Customer Procedure

CREATE PROCEDURE DeleteCustomer(
    in p_customer_id int
)
BEGIN
    DELETE FROM Customers WHERE customer_id = p_customer_id;
END//

DELIMITER ;