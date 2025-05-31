// Citation for use of AI Tools:
// Date: 05/30/2025
// Prompts used to generate javascript to check for incorrect customer data entry when creating customer accounts. 
// Currently, my forms directs me to a javascript page when a sql query doesn't return valid data. How can I have a popup on the page instead? 
// The form is displaying the same error with the javascript page linked. How can I check the page is loaded before the javascript? 
// Please explain the headers in the response const in detail. 
// AI Source URL: https://chatgpt.com/
document.addEventListener('DOMContentLoaded', function (){
    const form = document.getElementById('create_ca_form');
    if (!form) {
        console.error('Form with id create_ca_form not found.');
        return;
    }

    form.addEventListener('submit', async function (event){
        event.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        try{
            const response = await fetch('/create_customer_account', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(data),
            });
            
            if (response.ok) {
                window.location.href = '/customers_accounts';
            }else{
                const errorData = await response.json();
                alert(errorData.error || 'Check that customer and account exists.');
            }
        }

        catch (error) {
            console.error('Error:', error);
            alert('Error creating customer account. Please try again.');
        }
    });
});