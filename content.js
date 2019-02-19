let submit = document.getElementById('previewAnswers_id');
let textFields = document.getElementsByTagName('input');
let selections = document.getElementsByTagName('select');
let images = document.getElementsByTagName('img');

console.log(images.length);

function saveHistory(){
    console.log(textFields);
    console.log(selections);
    console.log("test");
}
if (submit != null) {
    submit.addEventListener('click', saveHistory);
    console.log("test");
}