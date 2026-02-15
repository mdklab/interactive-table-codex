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

export const setProcessButtonState = (processButton, valid) => {
  const shouldDisable = !valid;

  processButton.disabled = shouldDisable;

  if (typeof processButton.toggleAttribute === "function") {
    processButton.toggleAttribute("disabled", shouldDisable);
  }
};

export const initCsvUpload = ({ input, status, processButton }) => {
  if (!input || !status || !processButton) {
    return;
  }

  const setStatus = ({ valid, message }) => {
    status.textContent = message;
    status.dataset.state = valid ? "success" : "error";
    setProcessButtonState(processButton, valid);
  };

  setProcessButtonState(processButton, false);

  input.addEventListener("change", (event) => {
    const [selectedFile] = event.target?.files ?? input.files ?? [];
    setStatus(validateCsvFile(selectedFile));
  });
};
