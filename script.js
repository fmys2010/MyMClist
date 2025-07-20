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

    const totalMaterials = {};

    rows.forEach(row => {
      const [item, total, missing, available] = row.split('|').map(cell => cell.trim());
      if (!item) return;

      const existingRow = Array.from(materialTable.rows).find(r => r.cells[1].textContent === item);

      if (existingRow) {
        if (mode === 'overwrite') {
          existingRow.cells[2].textContent = total;
          existingRow.cells[3].textContent = available;
          existingRow.cells[4].textContent = missing;
        } else if (mode === 'merge') {
          existingRow.cells[2].textContent = parseInt(existingRow.cells[2].textContent) + parseInt(total);
          existingRow.cells[3].textContent = parseInt(existingRow.cells[3].textContent) + parseInt(available);
          existingRow.cells[4].textContent = parseInt(existingRow.cells[4].textContent) + parseInt(missing);
        }
      } else {
        const newRow = materialTable.insertRow();
        const imgCell = newRow.insertCell(0);
        const img = document.createElement('img');
        img.src = `https://minecraft.fandom.com/wiki/${item.replace(/\s+/g, '_')}`;
        img.alt = item;
        imgCell.appendChild(img);

        newRow.insertCell(1).textContent = item;
        newRow.insertCell(2).textContent = total;
        newRow.insertCell(3).textContent = available;
        newRow.insertCell(4).textContent = missing;
      }

      if (!totalMaterials[item]) {
        totalMaterials[item] = { total: 0, missing: 0, available: 0 };
      }
      totalMaterials[item].total += parseInt(total);
      totalMaterials[item].missing += parseInt(missing);
      totalMaterials[item].available += parseInt(available);
    });

    console.log('总材料统计:', totalMaterials);
  };

  reader.readAsText(file);
}
