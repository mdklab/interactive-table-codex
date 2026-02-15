const allowedMimeTypes = new Set([
  "text/csv",
  "application/csv",
  "application/vnd.ms-excel"
]);

export const validateCsvFile = (file) => {
  if (!file) {
    return { valid: false, message: "Please choose a CSV file to upload." };
  }

  const fileName = file.name ?? "";
  const hasCsvExtension = fileName.toLowerCase().endsWith(".csv");
  const hasKnownCsvMime = file.type ? allowedMimeTypes.has(file.type) : false;

  if (!hasCsvExtension && !hasKnownCsvMime) {
    return {
      valid: false,
      message: "Invalid file type. Please upload a .csv file."
    };
  }

  if (file.size === 0) {
    return {
      valid: false,
      message: "The selected CSV file is empty. Please choose a file with data."
    };
  }

  return {
    valid: true,
    message: `Ready to process ${fileName}.`
  };
};

export const initCsvUpload = ({ input, status }) => {
  if (!input || !status) {
    return;
  }

  const setStatus = ({ valid, message }) => {
    status.textContent = message;
    status.dataset.state = valid ? "success" : "error";
  };

  input.addEventListener("change", () => {
    const [selectedFile] = input.files ?? [];
    setStatus(validateCsvFile(selectedFile));
  });
};
