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

// Saves submitted values into Chrome sync storage
function saveEntry(submittedValues, dateTime, url){
    JSON.stringify(submittedValues);
    chrome.storage.sync.set({'url' : url, 'submissionDate' : dateTime, 'answers' : submittedValues}, function() {
        console.log("Submission saved.");
    });
}

// Writes values to page (in appropriate slots) from storage (called from popup.js) - Rollback feature
function writeToPage() {
    chrome.storage.sync.get(['url', 'submissionDate', 'answers'], function (items) {
        if (validateURL(items.url, url)) {
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
        }
    });
}

// Validates URL to ensure answers are written to the right question
function validateURL(storedURL, curURL){
    // URLs for question can vary, but all share same split prior to first ?
    return(curURL.includes(storedURL.split("?")[0]));
}

window.onload = augmentSubmissionButton; // Injects JavaScript into submission button on page load
window.onload = createFramePopup;

function showHistory(){

}

function createFramePopup(){
    let width = 350;
    let height = 500;
    let spacing = 65;

    // Dialog Box Setup
    let dialog1 = document.createElement("div");
    dialog1.id = "dialog1";
    dialog1.title = "Toolbox";
    dialog1.hidden = true;

    // Select menu setup
    let webSelect = document.createElement("select");
    webSelect.onchange = setSource;
    dialog1.appendChild(webSelect);

    let item1 = document.createElement("option");
    item1.label="Graphing Calculator (Desmos)";
    item1.value="https://www.desmos.com/calculator";
    let item2 = document.createElement("option");
    item2.label="Scientific Calculator (Desmos)";
    item2.value="https://www.desmos.com/scientific";
    let item3 = document.createElement("option");
    item3.label="Derivative Calculator (Wolfram Alpha)";
    item3.value="https://www.wolframalpha.com/widget/widgetPopup.jsp?p=v&id=f4ccdf86d504bc91f8652fa6d7b76db6&title=Derivative+Calculator&theme=blue&i0=1st&i1=-6%2Fx&podSelect&includepodid=Input&podstate=Input__Step-by-step+solution&showAssumptions=1&showWarnings=1";
    let item4 = document.createElement("option");
    item4.label="Integral Calculator (Wolfram Alpha)";
    item4.value="www.wolframalpha.com/widget/widget.jsp?id=539ef7f650041a2d28cadf9ad0292bf2";
    let item5 = document.createElement("option");
    item5.label="Matrix Calculator";
    item5.value="https://matrixcalc.org/en/";
    webSelect.appendChild(item1);
    webSelect.appendChild(item2);
    webSelect.appendChild(item3);
    webSelect.appendChild(item4);
    webSelect.appendChild(item5);

    // iframe Setup
    let iframe = document.createElement("iframe");
    iframe.src = "https://www.desmos.com/calculator";
    iframe.style.border = 'none';
    iframe.style.width = width.toString() + "px";
    iframe.style.height = height.toString() + "px";
    dialog1.appendChild(iframe);

    let script = document.createElement("script");
    script.style = "{visibility: hidden}";
    dialog1.appendChild(script);

    // Function run when selection made to dropdown in iframe
    function setSource(){
        let item = webSelect.options[webSelect.selectedIndex];
        iframe.src = item.value;
        console.log(item.label);
        if (item.label == "Graphing Calculator (Desmos)") {
            setDimensions(350, 500);
            iframe.style = "{visibility: visible}";
            script.style = "{visibility: hidden}";
        }
        else if (item.label == "Scientific Calculator (Desmos)") {
            setDimensions(350, 500);
            iframe.style = "{visibility: visible}";
            script.style = "{visibility: hidden}";
        }
        else if (item.label == "Derivative Calculator (Wolfram Alpha)") {
            setDimensions(800, 500);
            iframe.style = "{visibility: hidden}";
            script.style = "{visibility: visible}";
        }
        else if (item.label == "Integral Calculator (Wolfram Alpha)"){
            setDimensions(800, 500);
            iframe.style = "{visibility: hidden}";
            script.style = "{visibility: visible}";
        }
        else if (item.label == "Matrix Calculator"){
            setDimensions(800, 500);
            iframe.style = "{visibility: visible}";
            script.style = "{visibility: hidden}";
        }
    }

    function setDimensions(newWidth, newHeight){
        $( "#dialog1" ).dialog({
            width: newWidth + spacing,
            height: newHeight + spacing + 40 // 40px to compensate for menu
        });
        iframe.width = newWidth;
        iframe.height = newHeight;
        console.log(newWidth);
        console.log(newHeight);
    }

    // Button for toggling visibility
    let button = document.createElement('input');
    button.type = 'submit';
    button.id = "opener";
    button.className = "btn btn-primary";
    button.textContent = "Open Tool Box";

    // Inserting elements onto web page
    let insertionDiv = document.getElementById("bs-container");
    document.body.insertBefore(dialog1, insertionDiv);
    document.body.insertBefore(button, insertionDiv.nextSibling);
    insertionDiv.appendChild(button);

    // JavaScript Setup
    $(function () {
        $( "#dialog1" ).dialog({
            autoOpen: false,
            width: width + spacing,
            height: height + spacing + 45 // 40px to compensate for menu
        });

        $("#opener").click(function() {
            $("#dialog1").dialog('open');
        });
    });
}