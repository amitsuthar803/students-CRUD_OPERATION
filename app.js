const openModalBtn = document.querySelectorAll("[data-modal-target]");
const closeModalBtn = document.querySelectorAll("[data-close-button]");
const overlay = document.querySelector(".overlay");

// Function to initialize students array in local storage
function initializeStudents() {
  const initialStudents = [
    {
      id: 1,
      name: "amit suthar",
      father: "hitesh suthar",
      class: 11,
      mobile: 7014780586,
      address: "semaliya",
    },
    {
      id: 2,
      name: "lochan suthar",
      father: "hitesh suthar",
      class: 12,
      mobile: 9950554371,
      address: "semaliya",
    },
    {
      id: 3,
      name: "dikshant suthar",
      father: "ramesh suthar",
      class: 10,
      mobile: 9469326414,
      address: "bhiluda",
    },
    {
      id: 4,
      name: "shraddha suthar",
      father: "ramesh suthar",
      class: 12,
      mobile: 9153341515,
      address: "semaliya",
    },
  ];
  localStorage.setItem("students", JSON.stringify(initialStudents));
}

// Function to get students from local storage
function getStudents() {
  return JSON.parse(localStorage.getItem("students")) || [];
}

// Function to remove a student from local storage by ID
function removeStudent(studentId) {
  let students = getStudents();

  // Filter out the student with the given ID
  students = students.filter((student) => student.id !== studentId);

  // Update local storage with the modified students array
  localStorage.setItem("students", JSON.stringify(students));
  renderStudents();
}

function editStudent(btn) {
  let row = btn.parentElement.parentElement;
  let cells = row.getElementsByTagName("td");

  if (btn.textContent === "✏️") {
    const nameInput = document.createElement("input");
    nameInput.classList.add("edit");
    nameInput.value = cells[1].textContent;
    cells[1].innerHTML = "";
    cells[1].appendChild(nameInput);

    const fatherNameInput = document.createElement("input");
    fatherNameInput.classList.add("edit");
    fatherNameInput.value = cells[2].textContent;
    cells[2].innerHTML = "";
    cells[2].appendChild(fatherNameInput);

    const classInput = document.createElement("input");
    classInput.classList.add("edit");
    classInput.value = cells[3].textContent;
    cells[3].innerHTML = "";
    cells[3].appendChild(classInput);

    const mobileInput = document.createElement("input");
    mobileInput.classList.add("edit");
    mobileInput.value = cells[4].textContent;
    cells[4].innerHTML = "";
    cells[4].appendChild(mobileInput);

    const addressInput = document.createElement("input");
    addressInput.classList.add("edit");
    addressInput.value = cells[5].textContent;
    cells[5].innerHTML = "";
    cells[5].appendChild(addressInput);

    btn.textContent = "Save";
    btn.classList.remove("edit-btn");
    btn.classList.add("save-btn");
  } else {
    const studentId = parseInt(cells[0].textContent);
    const nameInput = cells[1].getElementsByTagName("input")[0];
    const fatherNameInput = cells[2].getElementsByTagName("input")[0];
    const classInput = cells[3].getElementsByTagName("input")[0];
    const mobileInput = cells[4].getElementsByTagName("input")[0];
    const addressInput = cells[5].getElementsByTagName("input")[0];

    let students = getStudents();
    const studentIndex = students.findIndex(
      (student) => student.id === studentId
    );

    students[studentIndex].name = nameInput.value;
    students[studentIndex].father = fatherNameInput.value;
    students[studentIndex].class = classInput.value;
    students[studentIndex].mobile = mobileInput.value;
    students[studentIndex].address = addressInput.value;

    localStorage.setItem("students", JSON.stringify(students));

    cells[1].textContent = nameInput.value;
    cells[2].textContent = fatherNameInput.value;
    cells[3].textContent = classInput.value;
    cells[4].textContent = mobileInput.value;
    cells[5].textContent = addressInput.value;

    btn.textContent = "✏️";
    btn.classList.remove("save-btn");
    btn.classList.add("edit-btn");
  }
}

// Function to render students in the table
function renderStudents() {
  const studentData = getStudents();
  const tableBody = document.querySelector(".table-container tbody");

  if (!tableBody) return; // Safety check

  tableBody.innerHTML = ""; // Clear existing table rows

  studentData.forEach((student) => {
    let students = `<tr>
      <td  data-label="Sr." >${student.id}</td>
      <td data-label="Name" >${student.name}</td>
      <td data-label="Father Name" >${student.father}</td>
      <td data-label="Class" >${student.class}</td>
      <td data-label="Mobile no" >${student.mobile}</td>
      <td data-label="Address" >${student.address}</td>`;

    // Append additional action column if on manageStudent.html

    students += `
        <td data-label="Action" class="">
          <button class="edit-student btn">✏️</button>
          <button class="remove-student btn" data-student-id="${student.id}">🗑️</button>
        </td>`;

    students += `</tr>`;

    tableBody.innerHTML += students;
  });

  // Reattach event listeners for remove buttons
  const removeStudentBtns = document.querySelectorAll(".remove-student");
  removeStudentBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const studentId = parseInt(btn.dataset.studentId);
      removeStudent(studentId);
    });
  });

  const editStudentBtn = document.querySelectorAll(".edit-student");
  editStudentBtn.forEach((button) => {
    button.addEventListener("click", function () {
      editStudent(button);
    });
  });
}
// Function to handle form submission for creating new student
const createStudentForm = document.querySelector(".create-form");
createStudentForm?.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.querySelector("#name").value;
  const studentclass = document.querySelector("#class").value;
  const fathername = document.querySelector("#fathername").value;
  const mobileNumber = document.querySelector("#mobileNumber").value;
  const address = document.querySelector("#address").value;

  const studentData = getStudents();
  const lastStudent = studentData[studentData.length - 1];
  const newId = lastStudent ? lastStudent.id + 1 : 1;

  const newStudent = {
    id: newId,
    name: name,
    father: fathername,
    class: studentclass,
    mobile: mobileNumber,
    address: address,
  };

  const duplicateStudent = studentData.find(
    (student) =>
      student.name === newStudent.name &&
      student.father === newStudent.father &&
      student.mobile === newStudent.mobile &&
      student.class === newStudent.class
  );

  if (duplicateStudent) {
    alert(
      "A student with the same information already exists., please reach to technical team for further!"
    );
    return;
  }

  studentData.push(newStudent);
  localStorage.setItem("students", JSON.stringify(studentData));

  // Update UI after adding new student
  renderStudents();

  // Reset form fields
  createStudentForm.reset();
});

// Function to clear all students from local storage
function clearStudents() {
  localStorage.removeItem("students");
  renderStudents(); // Update UI after clearing
}

// Initialize students when the script is first loaded
document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("students")) {
    initializeStudents();
  }

  // Render initial students on page load
  renderStudents();
});

openModalBtn.forEach((button) => {
  button.addEventListener("click", () => {
    const modal = document.querySelector(button.dataset.modalTarget);
    openModal(modal);
  });
});

closeModalBtn.forEach((button) => {
  button.addEventListener("click", () => {
    const modal = button.closest(".modal");
    closeModal(modal);
  });
});

function openModal(modal) {
  if (modal == null) return;
  modal.classList.add("active");
  overlay.classList.add("active");
}

function closeModal(modal) {
  if (modal == null) return;
  modal.classList.remove("active");
  overlay.classList.remove("active");
}
