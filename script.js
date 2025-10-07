document.addEventListener("DOMContentLoaded", () => {
  // Get references to DOM elements
  const expenseForm = document.getElementById("expense-form");
  const expenseNameInput = document.getElementById("expense-name");
  const expenseAmountInput = document.getElementById("expense-amount");
  const expenseList = document.getElementById("expense-list");
  const totalAmountDisplay = document.getElementById("total-amount");

  // Load saved expenses from localStorage or initialize empty array
  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

  // Calculate initial total amount from saved expenses
  let totalAmount = calculateTotal();

  // Display existing expenses and total on page load
  renderExpenses();
  updateTotal();

  // Handle form submission (when user adds a new expense)
  expenseForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent page reload on form submit

    // Get input values
    const name = expenseNameInput.value.trim();
    const amount = parseFloat(expenseAmountInput.value.trim());

    // Validate inputs: name should not be empty, amount must be a positive number
    if (name !== "" && !isNaN(amount) && amount > 0) {
      // Create a new expense object with a unique ID
      const newExpense = {
        id: Date.now(),
        name: name,
        amount: amount,
      };

      // Add new expense to the list
      expenses.push(newExpense);

      // Save updated expense list to localStorage
      saveExpensesTolocal();

      // Re-render expense list and update total amount
      renderExpenses();
      updateTotal();

      // Clear input fields after submission
      expenseNameInput.value = "";
      expenseAmountInput.value = "";
    }
  });

  // Function to display all expenses in the list
  function renderExpenses() {
    expenseList.innerHTML = ""; // Clear the list before rendering
    expenses.forEach((expense) => {
      // Create a list item for each expense
      const li = document.createElement("li");
      li.innerHTML = `
          ${expense.name} - $${expense.amount}
          <button data-id="${expense.id}">Delete</button>
          `;
      expenseList.appendChild(li); // Add it to the list
    });
  }

  // Function to calculate the total of all expenses
  function calculateTotal() {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }

  // Function to save expenses array to localStorage
  function saveExpensesTolocal() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }

  // Function to update total amount display
  function updateTotal() {
    totalAmount = calculateTotal();
    totalAmountDisplay.textContent = totalAmount.toFixed(2); // Show 2 decimal places
  }

  // Event listener for deleting an expense
  expenseList.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      // Get the ID of the expense to delete
      const expenseId = parseInt(e.target.getAttribute("data-id"));

      // Filter out the expense with the matching ID
      expenses = expenses.filter((expense) => expense.id !== expenseId);

      // Save updated list and refresh UI
      saveExpensesTolocal();
      renderExpenses();
      updateTotal();
    }
  });
});
