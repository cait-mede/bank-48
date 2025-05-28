DROP PROCEDURE IF EXISTS DeleteCustomer;
DELIMITER //

-- Delete Customer Procedure

CREATE PROCEDURE DeleteCustomer(
    in p_customer_id int
)
BEGIN
    DELETE FROM Customers WHERE customer_id = p_customer_id;
END//

DELIMITER ;