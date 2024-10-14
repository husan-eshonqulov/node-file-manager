const convertToTable = (data) => {
  if (typeof data !== 'object') {
    return data;
  }

  return Array.isArray(data) ? formatArr(data) : formatObj(data);
};

const formatObj = (obj) => {
  const headers = ['(index)', 'Values'];
  const rows = Object.entries(obj);

  return createTable(headers, rows);
};

const formatArr = (arr) => {
  const headers = [
    '(index)',
    ...(typeof arr[0] === 'object' ? Object.keys(arr[0]) : ['Values']),
  ];

  const rows = arr.map((item, index) =>
    typeof item === 'object' ? [index, ...Object.values(item)] : [index, item]
  );

  return createTable(headers, rows);
};

const createTable = (headers, rows) => {
  const colWidths = headers.map((header, i) =>
    Math.max(header.length, ...rows.map((row) => String(row[i] || '').length))
  );

  const generateBorder = (type) => {
    const borders = {
      top: ['┌', '┬', '┐'],
      middle: ['├', '┼', '┤'],
      bottom: ['└', '┴', '┘'],
    };

    const [left, mid, right] = borders[type];

    return `${left}${colWidths
      .map((width) => '─'.repeat(width + 2))
      .join(mid)}${right}\n`;
  };

  const formatRow = (row) =>
    `│${row
      .map((cell, i) => ` ${String(cell).padEnd(colWidths[i])} `)
      .join('│')}│\n`;

  let output = generateBorder('top');
  output += formatRow(headers);
  output += generateBorder('middle');
  rows.forEach((row) => {
    output += formatRow(row);
  });
  output += generateBorder('bottom');

  return output;
};

export default convertToTable;
