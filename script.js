const form = document.getElementById("coverLetterForm");
const output = document.getElementById("output");
const copyBtn = document.getElementById("copyBtn");

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const role = document.getElementById("role").value.trim();
    const company = document.getElementById("company").value.trim();
    const skills = document.getElementById("skills").value.trim();

    output.innerText = "Generating cover letter...";

    try {

        const response = await fetch("http://localhost:5000/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                role,
                company,
                skills
            })
        });

        const data = await response.json();

        if (data.coverLetter) {
            output.innerText = data.coverLetter;
        } else {
            output.innerText = data.error || "Something went wrong.";
        }

    } catch (error) {

        console.error(error);
        output.innerText = "Something went wrong. Please try again.";

    }

});

copyBtn.addEventListener("click", function () {

    navigator.clipboard.writeText(output.innerText);

    alert("Cover Letter copied successfully!");

});