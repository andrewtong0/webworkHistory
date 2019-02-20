let submissionValues = []; // Dictionary storing entries
let url = String(window.location.href); // Save URL of page for sorting

// Finds all user entries and saves them
function saveSubmission(){
    let dateTime = new Date();
    let currentDateTime = dateTime.getDate() + "/"
        + (dateTime.getMonth()+1)  + "/"
        + dateTime.getFullYear() + " @ "
        + dateTime.getHours() + ":"
        + dateTime.getMinutes() + ":"
        + dateTime.getSeconds();

    // Find all user submitted fields, add to list, and store in submissionValues dict
    let submissionArea = document.getElementById("problem_body");
    let submissionFields = submissionArea.querySelectorAll('input, select');
    for (let i = 0; i < submissionFields.length; i++){
        let id = submissionFields[i].id;
        // If a user submitted answer is located, store to dict
        if (id.includes("AnSwEr")){
            // Create JS object of a user entry
            let entry = {
                name: submissionFields[i].name,
                type: submissionFields[i].type,
                answer: ""
            }
            // Checkboxes handled differently since value == label
            // Changes here should be reflected in writeToPage below
            if (submissionFields[i].type == "checkbox"){
                entry.answer = submissionFields[i].checked;
                entry.name = submissionFields[i].value;
            }
            else {
                entry.answer = submissionFields[i].value;
            }
            submissionValues.push(entry);
        }
    }
    saveEntry(submissionValues, currentDateTime, url);
}

// Augments submission button with event listener to allow for answer storage
function augmentSubmissionButton() {
    // Identify submit button for adding event listener
    let submit = document.getElementById('previewAnswers_id');
    submit.addEventListener('click', saveSubmission);
}

function saveEntry(submittedValues, dateTime, url){
    JSON.stringify(submittedValues);
    chrome.storage.sync.set({'url' : url, 'submissionDate' : dateTime, 'answers' : submittedValues}, function() {
        console.log("Submission saved.");
    });
}

// Writes values to page from storage (called from popup.js)
function writeToPage() {
    chrome.storage.sync.get(['url', 'submissionDate', 'answers'], function (items) {
        //if (validateURL(items.url, url)) {
            let submissionArea = document.getElementById("problem_body");
            let submissionFields = submissionArea.querySelectorAll('input, select');
            console.log(submissionFields);

            console.log(items.answers);
            console.log(submissionFields);
            for (let i = 0; i < submissionFields.length; i++) {
                for (let j = 0; j < items.answers.length; j++) {
                    console.log(submissionFields[i].name == items.answers[j].name);
                    if (submissionFields[i].name == items.answers[j].name || submissionFields[i].value == items.answers[j].name) {
                        if (submissionFields[i].type == "checkbox") {
                            submissionFields[i].checked = items.answers[j].answer;
                        } else {
                            submissionFields[i].value = items.answers[j].answer;
                        }
                    }
                }
            }
            console.log("Reloaded previous submission");
            console.log(items.submissionDate);
            console.log(items.answers);
        //}
    });
}

function validateURL(storedURL, curURL){

}

window.onload = augmentSubmissionButton;