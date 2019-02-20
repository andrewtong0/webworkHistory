

let data = document.getElementsByClassName('codeshard');
value = '';
for (i = 0; i < data.length; i++) {
	value = value.concat(` ${data[i].value}`);
}

let toModify = document.getElementById('problem_body');
let theOne = toModify.childNodes[9];
theOne.style.display= 'grid';
theOne.style.gridTemplateColumns = '3fr 1fr';
let span2 = theOne.childNodes[2];
let span10 = theOne.childNodes[1];

span2.style.gridColumn = 2;
span10.style.gridColumn = 1;

let iframe = document.createElement("iframe");
iframe.src = "https://www.desmos.com/calculator";
iframe.style.border = 'none';
iframe.style.width = '300px';
iframe.style.height = '500px';

span2.appendChild(iframe);

chrome.storage.sync.set({answer: `${value}`}, function() {
});