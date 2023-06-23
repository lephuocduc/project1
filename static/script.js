$(document).ready(function() {
  $("#terraformTable").tablesorter();
  
  const vmNameInput = document.getElementById('vmName');

  // Extract existing VM names from the page
  let existingVMNames = [];
  const resourcesDataDiv = document.getElementById('resourcesData');
  let resources = JSON.parse(resourcesDataDiv.getAttribute('data-resources'));
  
  for (let resource of resources) {
      existingVMNames.push(resource.vCenterName, resource.terraformName);
  }
  
  vmNameInput.addEventListener('input', function (event) {
      const value = event.target.value;
      const regex = /^[a-zA-Z_][a-zA-Z0-9_-]*$/;

      if (!regex.test(value)) {
          vmNameInput.setCustomValidity('Invalid VM name. Name must start with a letter or underscore and may contain only letters, digits, underscores, and dashes, no blank space.');
      } else if (existingVMNames.includes(value)) {
          vmNameInput.setCustomValidity('This VM name already exists. Please enter a unique name.');
      } else {
          vmNameInput.setCustomValidity('');
      }
  });

  let sortDirection = '';

  function sortTable(column) {
      const table = document.getElementById('terraformTable');
      const tbody = table.tBodies[0]; // gets the first <tbody> element
      const rows = Array.from(tbody.rows);

      // Sort rows
      rows.sort((a, b) => {
          const textA = a.cells[column].textContent;
          const textB = b.cells[column].textContent;

          if (sortDirection === 'asc') {
              return textA.localeCompare(textB, undefined, { numeric: true });
          } else {
              return textB.localeCompare(textA, undefined, { numeric: true });
          }
      });

      // Append the sorted rows to the table body
      rows.forEach((row) => {
          tbody.appendChild(row);
      });

      // Update sort direction and the sort indicator
      toggleSortDirection();
      updateSortIndicator(column);
  }

  function updateSortIndicator(column) {
      const headers = document.getElementsByTagName('th');

      for (let i = 0; i < headers.length; i++) {
          headers[i].classList.remove('asc', 'desc');
      }

      if (sortDirection === 'asc') {
          headers[column].classList.add('asc');
      } else {
          headers[column].classList.add('desc');
      }
  }

  function toggleSortDirection() {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
  }

  window.sortTable = sortTable; // make sortTable function accessible globally
});
