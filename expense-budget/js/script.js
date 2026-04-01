// ===== Get HTML Elements =====
const form = document.getElementById('transactionForm');
const itemNameInput = document.getElementById('itemName');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const transactionList = document.getElementById('transactionList');
const totalBalanceEl = document.getElementById('totalBalance');
const darkModeToggle = document.getElementById('darkModeToggle');

// ===== Chart.js Setup =====
const ctx = document.getElementById('myChart').getContext('2d');
let myChart = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: ['Food', 'Transport', 'Fun'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#3498db', '#2ecc71', '#e74c3c']
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' }
    }
  }
});

// ===== Load transactions from LocalStorage =====
function getTransactions() {
  return JSON.parse(localStorage.getItem('transactions')) || [];
}

// ===== Save transactions to LocalStorage =====
function saveTransactions(transactions) {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// ===== Render all transactions to the list =====
function renderTransactions() {
  const transactions = getTransactions();
  transactionList.innerHTML = '';

  transactions.forEach(function(transaction) {
    const li = document.createElement('li');
    li.className = transaction.amount >= 0 ? 'income' : 'expense';

    li.innerHTML = `
      <span>${transaction.name} (${transaction.category})</span>
      <span class="amount ${transaction.amount >= 0 ? 'income' : 'expense'}">
        $${Math.abs(transaction.amount).toFixed(2)}
      </span>
      <button class="btn-delete" onclick="deleteTransaction('${transaction.id}')">Delete</button>
    `;

    transactionList.appendChild(li);
  });

  updateTotalBalance(transactions);
  updateChart(transactions);
}

// ===== Update total balance display =====
function updateTotalBalance(transactions) {
  const total = transactions.reduce(function(sum, t) {
    return sum + t.amount;
  }, 0);

  totalBalanceEl.textContent = '$' + total.toFixed(2);
  totalBalanceEl.className = 'total-balance ' + (total >= 0 ? 'positive' : 'negative');
}

// ===== Update pie chart =====
function updateChart(transactions) {
  const totals = { Food: 0, Transport: 0, Fun: 0 };

  transactions.forEach(function(t) {
    if (totals[t.category] !== undefined) {
      totals[t.category] += Math.abs(t.amount);
    }
  });

  myChart.data.datasets[0].data = [totals.Food, totals.Transport, totals.Fun];
  myChart.update();
}

// ===== Add transaction on form submit =====
form.addEventListener('submit', function(e) {
  e.preventDefault();

  const name = itemNameInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const category = categoryInput.value;

  // Validate inputs
  if (!name || isNaN(amount) || !category) {
    alert('Please fill in all fields.');
    return;
  }

  const transaction = {
    id: Date.now().toString(),
    name: name,
    amount: amount,
    category: category
  };

  const transactions = getTransactions();
  transactions.push(transaction);
  saveTransactions(transactions);
  renderTransactions();

  // Clear form
  form.reset();
});

// ===== Delete a transaction =====
function deleteTransaction(id) {
  const transactions = getTransactions().filter(function(t) {
    return t.id !== id;
  });
  saveTransactions(transactions);
  renderTransactions();
}

// ===== Dark Mode Toggle =====
darkModeToggle.addEventListener('click', function() {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
  darkModeToggle.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
});

// ===== Load dark mode state on startup =====
function loadDarkMode() {
  if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark');
    darkModeToggle.textContent = '☀️ Light Mode';
  }
}

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("transactionForm");

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        const itemName = document.getElementById("itemName").value;
        const amount = document.getElementById("amount").value;
        const category = document.getElementById("category").value;

        console.log(itemName, amount, category);

    });

});

// ===== Initialize app =====
loadDarkMode();
renderTransactions();
