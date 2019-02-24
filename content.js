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
    console.log(submissionValues);
    saveEntry(submissionValues, currentDateTime, url);
}

// Augments submission button with event listener to allow for answer storage
function augmentSubmissionButton() {
    // Identify submit button for adding event listener
    console.log("TEST");
    let submit = document.getElementById('previewAnswers_id');
    submit.addEventListener('click', saveSubmission);
}

// Saves submitted values into Chrome sync storage
function saveEntry(submittedValues, dateTime, urlRaw){
    url = truncateURL(urlRaw);
    let items = [submittedValues, dateTime, url];
    JSON.stringify(items);
    chrome.storage.sync.set({[url] : items}, function() {
        console.log("Submission saved.");
    });
}

// Writes values to page (in appropriate slots) from storage (called from popup.js) - Rollback feature
function writeToPage() {
    url = truncateURL(url);
    chrome.storage.sync.get(url, function (items) {
        console.log(items[url]);
        console.log(url);
        if (items != null && validateURL(items[url][2], url)) {
            console.log("writing values");
            let submissionArea = document.getElementById("problem_body");
            let submissionFields = submissionArea.querySelectorAll('input, select');
            let submittedValues = items[url][0];
            let submittedDate = items[url][1];
            for (let i = 0; i < submissionFields.length; i++) {
                for (let j = 0; j < submittedValues.length; j++) {
                    if (submissionFields[i].name == submittedValues[j].name || submissionFields[i].value == submittedValues[j].name) {
                        if (submissionFields[i].type == "checkbox") {
                            submissionFields[i].checked = submittedValues[j].answer;
                        } else {
                            submissionFields[i].value = submittedValues[j].answer;
                        }
                    }
                }
            }
            console.log("Reloaded previous submission");
            console.log(submittedDate);
            console.log(submittedValues);
        }
    });
}

// Validates URL to ensure answers are written to the right question
function validateURL(storedURL, curURL){
    // URLs for question can vary, but all share same split prior to first ?
    return(curURL.includes(storedURL.split("?")[0]));
}
function truncateURL(url){
    return(url.split("?")[0]);
}

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

    // Resizing problem body
    let problemBody = document.getElementById('problem_body');
    let columns = problemBody.childNodes[9];
    columns.style.display= 'grid';
    columns.style.gridTemplateColumns = '3fr 1fr';
    let span2 = columns.childNodes[2];
    let span10 = columns.childNodes[1];
    span2.style.gridColumn = 2;
    span10.style.gridColumn = 1;

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

function onLoad(){
    augmentSubmissionButton();
    createFramePopup();
}

window.onload = onLoad; // Injects JavaScript into submission button on page load