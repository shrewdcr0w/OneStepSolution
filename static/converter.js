// --- Tab Switching Logic ---
function switchTab(mode, btnElement) {
  document
    .querySelectorAll(".tab-btn")
    .forEach((b) => b.classList.remove("active"));

  if (btnElement) {
    btnElement.classList.add("active");
  } else {
    const defaultBtn = document.querySelector(`.tab-btn[onclick*="${mode}"]`);
    if (defaultBtn) defaultBtn.classList.add("active");
  }

  document
    .querySelectorAll(".mode-content")
    .forEach((c) => c.classList.remove("active"));
  const targetMode = document.getElementById(`${mode}-mode`);
  if (targetMode) targetMode.classList.add("active");

  window.currentMode = mode;
}

document.addEventListener("DOMContentLoaded", () => {
  window.currentMode = "single";
  let allMergeFiles = [];

  // --- Selectors ---
  const singleInput = document.getElementById("single-file-input");
  const singleDrop = document.getElementById("single-drop");
  const singleNameDisplay = document.getElementById("single-file-name");

  const mergeInput = document.getElementById("merge-file-input");
  const mergeDrop = document.getElementById("merge-drop");
  const listDisplay = document.getElementById("merge-file-list");

  // --- Single File Handling ---
  if (singleDrop) {
    singleDrop.addEventListener("click", () => singleInput.click());
    singleInput.addEventListener("change", (e) => {
      if (e.target.files[0]) {
        singleNameDisplay.innerText = `📄 Selected: ${e.target.files[0].name}`;
      }
    });
  }

  // --- Merge File Handling ---
  if (mergeDrop) {
    mergeDrop.addEventListener("click", () => mergeInput.click());
    mergeInput.addEventListener("change", (e) => {
      const newFiles = Array.from(e.target.files);
      allMergeFiles = [...allMergeFiles, ...newFiles];
      renderMergeList();
      mergeInput.value = "";
    });
  }

  function renderMergeList() {
    if (!listDisplay) return;
    listDisplay.innerHTML = allMergeFiles
      .map(
        (f, index) => `
            <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.1); padding: 8px; margin-bottom: 5px; border-radius: 4px; border: 1px dashed #fff;">
                <span>➕ ${f.name}</span>
                <span style="color: #ffb7b7; cursor: pointer; padding: 0 5px;" onclick="removeFile(${index})">✖</span>
            </div>
        `
      )
      .join("");
  }

  window.removeFile = (index) => {
    allMergeFiles.splice(index, 1);
    renderMergeList();
  };

  // --- Conversion Process ---
  const convertBtn = document.getElementById("convert-btn");
  if (convertBtn) {
    convertBtn.addEventListener("click", async () => {
      const overlay = document.getElementById("process-overlay");
      const timerDisplay = document.getElementById("timer");
      const outputCard = document.getElementById("result-card");
      const placeholder = document.getElementById("output-placeholder");

      let formData = new FormData();
      const mode = window.currentMode;

      // 1. Validation
      if (mode === "single") {
        const file = singleInput.files[0];
        if (!file) return alert("Please select a file first!");
        formData.append("files", file);
      } else {
        if (allMergeFiles.length < 2)
          return alert("Please select at least 2 files to merge!");
        allMergeFiles.forEach((file) => formData.append("files", file));
      }

      const format = document.getElementById("format-select").value;
      formData.append("format", format);
      formData.append("mode", mode);

      // 2. UI Start
      overlay.classList.remove("hidden");
      let startTime = Date.now();
      let timerInterval = setInterval(() => {
        let elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        timerDisplay.innerText = elapsed + "s";
      }, 100);

      try {
        const response = await fetch("/convert_files", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorMsg = await response.text();
          throw new Error(errorMsg || "Conversion failed");
        }

        const blob = await response.blob();
        const downloadUrl = URL.createObjectURL(blob);

        // 3. Success UI
        clearInterval(timerInterval);
        overlay.classList.add("hidden");
        if (placeholder) placeholder.style.display = "none";
        if (outputCard) outputCard.classList.remove("hidden");

        document.getElementById(
          "out-filename"
        ).innerText = `Chalkboard_Export.${format}`;
        document.getElementById("out-size").innerText =
          (blob.size / 1024).toFixed(1) + " KB";

        const saveBtn = document.getElementById("save-btn");
        // Remove old listeners to prevent double downloads
        const newBtn = saveBtn.cloneNode(true);
        saveBtn.parentNode.replaceChild(newBtn, saveBtn);

        newBtn.addEventListener("click", () => {
          const a = document.createElement("a");
          a.href = downloadUrl;
          a.download = `converted_${Date.now()}.${format}`;
          document.body.appendChild(a);
          a.click();
          a.remove();
        });
      } catch (error) {
        clearInterval(timerInterval);
        overlay.classList.add("hidden");
        console.error("Conversion Error:", error);
        alert("❌ Error: " + error.message);
      }
    });
  }
});
