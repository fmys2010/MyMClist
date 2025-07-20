function handleUpload() {
  const fileInput = document.getElementById('fileInput');
  const modeSelect = document.getElementById('modeSelect');
  const materialTable = document.getElementById('materialTable').getElementsByTagName('tbody')[0];

  if (!fileInput.files.length) {
    alert('请先选择一个文件！');
    return;
  }

  const file = fileInput.files[0];
  const mode = modeSelect.value;

  const reader = new FileReader();
  reader.onload = function (event) {
    const content = event.target.result;
    const rows = content.split('
').slice(1); // 假设第一行是标题

    rows.forEach(row => {
      const [item, total, missing, available] = row.split('|').map(cell => cell.trim());
      if (!item) return;

      const existingRow = Array.from(materialTable.rows).find(r => r.cells[0].textContent === item);

      if (existingRow) {
        if (mode === 'overwrite') {
          existingRow.cells[1].textContent = total;
          existingRow.cells[2].textContent = available;
          existingRow.cells[3].textContent = missing;
        } else if (mode === 'merge') {
          existingRow.cells[1].textContent = parseInt(existingRow.cells[1].textContent) + parseInt(total);
          existingRow.cells[2].textContent = parseInt(existingRow.cells[2].textContent) + parseInt(available);
          existingRow.cells[3].textContent = parseInt(existingRow.cells[3].textContent) + parseInt(missing);
        }
      } else {
        const newRow = materialTable.insertRow();
        newRow.insertCell(0).textContent = item;
        newRow.insertCell(1).textContent = total;
        newRow.insertCell(2).textContent = available;
        newRow.insertCell(3).textContent = missing;
      }
    });
  };

  reader.readAsText(file);
}
