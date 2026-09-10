document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("single-file-input");
  const singleDrop = document.getElementById("single-drop");
  const fileNameDisplay = document.getElementById("single-file-name");
  const passwordInput = document.getElementById("file-password");
  const convertBtn = document.getElementById("convert-btn");

  const loadingOverlay = document.getElementById("loading-overlay");
  const resultCard = document.getElementById("result-card");
  const outputPlaceholder = document.getElementById("output-placeholder");
  const outFilename = document.getElementById("out-filename");
  const saveBtn = document.getElementById("save-btn");

  let processedBlob = null;

  // Trigger file selection
  singleDrop.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", () => {
    if (fileInput.files[0]) {
      fileNameDisplay.innerHTML = `<i class="fas fa-file"></i> ${fileInput.files[0].name}`;
    }
  });

  convertBtn.addEventListener("click", async () => {
    if (!fileInput.files[0]) return alert("Please select a file!");
    if (!passwordInput.value) return alert("Please set a password!");

    loadingOverlay.classList.remove("hidden");

    const formData = new FormData();
    // Send as 'files' to match the Flask request.files.getlist('files')
    formData.append("file", fileInput.files[0]);
    formData.append("password", passwordInput.value);
    formData.append("mode", "single");

    // Extract format from filename
    const format = fileInput.files[0].name.split(".").pop().toLowerCase();
    formData.append("format", format);

    try {
      const response = await fetch("/protect_pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error(await response.text());

      processedBlob = await response.blob();

      // UI Updates
      loadingOverlay.classList.add("hidden");
      if (outputPlaceholder) outputPlaceholder.classList.add("hidden");
      resultCard.classList.remove("hidden");
      outFilename.innerText = "protected_" + fileInput.files[0].name;
      document.getElementById("out-size").innerText =
        (processedBlob.size / 1024).toFixed(1) + " KB";
    } catch (err) {
      loadingOverlay.classList.add("hidden");
      alert("Error: " + err.message);
    }
  });

  saveBtn.addEventListener("click", () => {
    if (!processedBlob) return;
    const url = URL.createObjectURL(processedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "protected_" + fileInput.files[0].name;
    a.click();
  });
});
