// chrome.runtime.onInstalled.addListener(function() {
//     chrome.storage.sync.set({color: '#f9fffb'}, function() {
//         console.log('The color is green.');
//             });
//
//             chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
//                 chrome.declarativeContent.onPageChanged.addRules([{
//                 conditions: [new chrome.declarativeContent.PageStateMatcher({
//                     pageUrl: {hostEquals: 'webwork.elearning.ubc.ca'},
//                 })
//             ],
//                 actions: [new chrome.declarativeContent.ShowPageAction()]
//         }]);
//     });
// });
//
// chrome.tabs.onUpdated.addListener(function (changeInfo){
//     if (changeInfo.status == 'complete') {
//         chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
//             chrome.tabs.executeScript(
//                 tabs[0].id,
//                 {code: 'document.getElementById("loginstatus").style.visibility = "hidden";'});
//         });
//     }
// });