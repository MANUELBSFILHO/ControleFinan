const tbody = document.querySelector("tbody");
const descItem = document.querySelector("#desc");
const amount = document.querySelector("#amount");
const type = document.querySelector("#type");
const btnNew = document.querySelector("#btnNew");

const incomes = document.querySelector(".incomes");
const expenses = document.querySelector(".expenses");
const total = document.querySelector(".total");

let items;

btnNew.onclick = () => {
  if (descItem.value === "" || amount.value === "" || type.value === "") {
    return alert("Preencha todos os campos!");
  }

  items.push({
    desc: descItem.value,
    amount: Math.abs(amount.value).toFixed(2),
    type: type.value,
  });

  setItensBD();

  loadItens();

  descItem.value = "";
  amount.value = "";
};

function deleteItem(index) {
  items.splice(index, 1);
  setItensBD();
  loadItens();
}

function insertItem(item, index) {
  let tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${item.desc}</td>
    <td>R$ ${item.amount}</td>
    <td class="columnType">${
      item.type === "Entrada"
        ? '<i class="bx bxs-chevron-up-circle"></i>'
        : '<i class="bx bxs-chevron-down-circle"></i>'
    }</td>
    <td class="columnAction">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `;

  tbody.appendChild(tr);
}

function loadItens() {
  items = getItensBD();
  tbody.innerHTML = "";
  items.forEach((item, index) => {
    insertItem(item, index);
  });

  getTotals();
}

function getTotals() {
  const amountIncomes = items
    .filter((item) => item.type === "Entrada")
    .map((transaction) => Number(transaction.amount));

  const amountExpenses = items
    .filter((item) => item.type === "Saída")
    .map((transaction) => Number(transaction.amount));

  const totalIncomes = amountIncomes
    .reduce((acc, cur) => acc + cur, 0)
    .toFixed(2);

  const totalExpenses = Math.abs(
    amountExpenses.reduce((acc, cur) => acc + cur, 0)
  ).toFixed(2);

  const totalItems = (totalIncomes - totalExpenses).toFixed(2);

  incomes.innerHTML = totalIncomes;
  expenses.innerHTML = totalExpenses;
  total.innerHTML = totalItems;
}

const getItensBD = () => JSON.parse(localStorage.getItem("db_items")) ?? [];
const setItensBD = () =>
  localStorage.setItem("db_items", JSON.stringify(items));

// Função para imprimir o relatório
function printReport() {
  window.print();
}

// Função para exportar o relatório como arquivo de texto
function exportReport() {
  const totalIncomes = parseFloat(incomes.textContent);
  const totalExpenses = parseFloat(expenses.textContent);
  const balance = totalIncomes - totalExpenses;

  let reportText = `Relatório de Despesas e Receitas\n\n`;
  
  reportText += `Total de Receitas: R$ ${totalIncomes.toFixed(2)}\n`;
  reportText += `Total de Despesas: R$ ${totalExpenses.toFixed(2)}\n`;
  reportText += `Saldo: R$ ${balance.toFixed(2)}\n\n`;

  if (items.length > 0) {
    reportText += `Detalhes:\n`;

    items.forEach((item, index) => {
      reportText += `${index + 1}. ${item.desc} - R$ ${item.amount} (${item.type})\n`;
    });
  } else {
    reportText += `Nenhuma transação registrada.`;
  }

  const blob = new Blob([reportText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'relatorio.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // Limpa a URL do objeto Blob
  URL.revokeObjectURL(url);
}

loadItens();
