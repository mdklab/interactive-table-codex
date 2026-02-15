const allowedMimeTypes = new Set([
  "text/csv",
  "application/csv",
  "application/vnd.ms-excel"
]);

export const validateCsvFile = (file) => {
  if (!file) {
    return { valid: false, message: "No file selected. Choose a CSV file to continue." };
  }

  const fileName = file.name ?? "";
  const hasCsvExtension = fileName.toLowerCase().endsWith(".csv");
  const hasKnownCsvMime = file.type ? allowedMimeTypes.has(file.type) : false;

  if (!hasCsvExtension && !hasKnownCsvMime) {
    return {
      valid: false,
      message: "Unsupported file type. Upload a .csv file (UTF-8 text)."
    };
  }

  if (file.size === 0) {
    return {
      valid: false,
      message: "The selected CSV file is empty. Add at least one header row and one data row."
    };
  }

  return {
    valid: true,
    message: `Ready to process ${fileName}.`
  };
};

export const initCsvUpload = ({ input, status, processButton }) => {
  if (!input || !status) {
    return;
  }

  const setStatus = ({ valid, message }) => {
    status.textContent = message;
    status.dataset.state = valid ? "success" : "error";
    setProcessButtonState(valid);
  };

  const setProcessButtonState = (valid) => {
    if (!processButton) {
      return;
    }

    processButton.disabled = !valid;
  };

  setProcessButtonState(false);

  input.addEventListener("change", () => {
    const [selectedFile] = input.files ?? [];
    setStatus(validateCsvFile(selectedFile));
  });
};
