document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Note Functionality ---
  const addNoteBtn = document.getElementById("add-note-btn");
  const notesArea = document.getElementById("notes-area");

  loadNotes();

  if (addNoteBtn) {
    addNoteBtn.addEventListener("click", () => {
      const x = 750;
      const y = 100 + Math.random() * 200;
      createNote("", x, y);
      saveNotes();
    });
  }

  function createNote(text = "", x = 100, y = 100) {
    const note = document.createElement("div");
    note.className = "note";
    note.style.left = `${x}px`;
    note.style.top = `${y}px`;

    note.innerHTML = `
            <button class="delete-btn">×</button>
            <textarea placeholder="Write here...">${text}</textarea>
        `;

    note.querySelector("textarea").addEventListener("input", saveNotes);
    note.querySelector(".delete-btn").onclick = () => {
      note.remove();
      saveNotes();
    };

    makeDraggable(note);
    notesArea.appendChild(note);
  }

  // --- 2. Permanent Logic  ---
  function saveNotes() {
    const notes = [];
    document.querySelectorAll(".note").forEach((note) => {
      notes.push({
        text: note.querySelector("textarea").value,
        x: parseInt(note.style.left) || 0,
        y: parseInt(note.style.top) || 0,
      });
    });
    localStorage.setItem("chalkboard_notes", JSON.stringify(notes));
  }

  function loadNotes() {
    const saved = localStorage.getItem("chalkboard_notes");
    if (saved) {
      JSON.parse(saved).forEach((data) => {
        createNote(data.text, data.x, data.y);
      });
    }
  }

  // --- 3. Drag Logic ---
  function makeDraggable(element) {
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    element.addEventListener("mousedown", (e) => {
      if (e.target.tagName === "TEXTAREA" || e.target.tagName === "BUTTON")
        return;

      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;

      const style = window.getComputedStyle(element);
      initialLeft = parseInt(style.left || 0);
      initialTop = parseInt(style.top || 0);

      element.style.zIndex = 1000;
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      element.style.left = `${initialLeft + dx}px`;
      element.style.top = `${initialTop + dy}px`;
    });

    window.addEventListener("mouseup", () => {
      if (isDragging) {
        isDragging = false;
        element.style.zIndex = "";
        saveNotes();
      }
    });
  }
});
