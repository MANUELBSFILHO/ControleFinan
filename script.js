const form = document.getElementById('finance-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const transactionList = document.getElementById('transaction-list');
const totalAmountDisplay = document.getElementById('total-amount');

let totalAmount = 0;

function addTransaction() {
  const description = descriptionInput.value;
  const amount = parseFloat(amountInput.value);
  const type = typeInput.value;

  if (description && !isNaN(amount)) {
    const listItem = document.createElement('li');
    listItem.textContent = `${description}: ${type === 'income' ? '+' : '-'} R$${amount.toFixed(2)}`;
    listItem.classList.add(type === 'income' ? 'income' : 'expenses');

    transactionList.appendChild(listItem);

    // Atualiza o somatório
    updateTotalAmount(type, amount);

    // Limpa os campos do formulário
    descriptionInput.value = '';
    amountInput.value = '';
  }
}

function updateTotalAmount(type, amount) {
  if (type === 'income') {
    totalAmount += amount;
  } else {
    totalAmount -= amount;
  }

  totalAmountDisplay.textContent = `R$${totalAmount.toFixed(2)}`;
}

function printReport() {
  const transactions = Array.from(transactionList.children).map(transaction => transaction.textContent).join('\n');

  // Usando html2canvas para capturar o conteúdo da página como uma imagem
  html2canvas(document.body).then(canvas => {
    const pdf = new jsPDF();
    
    // Adicionando a imagem do conteúdo da página ao PDF
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297);

    // Adicionando o texto das transações abaixo da imagem
    pdf.text(10, 10, transactions);

    // Abre uma nova janela com o PDF, onde o usuário pode clicar em "Imprimir"
    const newWindow = window.open();
    newWindow.document.write('<html><head><title>Relatório</title></head><body>');
    newWindow.document.write(`<pre>${transactions}</pre>`); // Mostra o texto como referência
    newWindow.document.write(`<img src="${canvas.toDataURL('image/png')}"/>`); // Mostra a imagem do conteúdo
    newWindow.document.write('</body></html>');
    newWindow.document.close();
    newWindow.print();
  });
}
