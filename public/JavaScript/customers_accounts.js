// Citation for use of AI Tools:
// Date: 05/30/2025
// Prompts used to generate javascript to check for incorrect customer data entry when creating customer accounts. 
// Currently, my forms directs me to a javascript page when a sql query doesn't return valid data. How can I have a popup on the page instead? 
// The form is displaying the same error with the javascript page linked. How can I check the page is loaded before the javascript? 
// Please explain the headers in the response const in detail. 
// How can I apply this event listener to other forms on the page? 
// AI Source URL: https://chatgpt.com/
document.addEventListener('DOMContentLoaded', function (){
    function handleForm(formID, endpoint, redirect) {
        const form = document.getElementById(formID);
        if (!form) {
            console.error('Form with id not found.');
            return;
        }

        form.addEventListener('submit', async function (event){
            event.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            try{
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json'},
                    body: JSON.stringify(data),
                });
                
                if (response.ok) {
                    window.location.href = redirect;
                }else{
                    const errorData = await response.json();
                    alert(errorData.error || 'Check that customer and account exists.');
                }
            }

            catch (error) {
                console.error('Error:', error);
                alert('Error with customer account. Please try again.');
            }
        });
}
handleForm('create_ca_form', '/create_customer_account', '/customers_accounts')
handleForm('update_ca_form', '/update_customer_account', '/customers_accounts')



});