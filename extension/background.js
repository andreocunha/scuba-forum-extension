const socket = io.connect('http://localhost:4000');
let user = ''
let url = ''

// create a popup when the extension is clicked
chrome.browserAction.onClicked.addListener(async function(tab) {

    chrome.storage.sync.get(['key'], function(result) {
        if(result.key){
            user = result.key
        }
    });
    
    await chrome.windows.create({
      url: chrome.runtime.getURL("popup.html"),
      type: "popup",
      height:300,
      width:200,
    });

    socket.emit('getInfo');
});

function setUser(userName) {
    user = userName
}

// function to verify if the string has anothere string inside
function contains(string, substring) {
    return string.indexOf(substring) !== -1;
}

// listen when url changes
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete' && user !== '') {
        if(contains(tab.url, "alura")){
            socket.emit('newTab', user, tab.url);
        }
    }
});

// listen when tab is changed
chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function(tab) {
        if(contains(tab.url, "alura") && user !== ''){
            socket.emit('newTab', user, tab.url);
            url = tab.url
        }
    });
});


function sendData(data){
    chrome.runtime.sendMessage(data)
}

socket.on('info', (data) => {
    let filterData = data.filter(item => item.url === url)
    sendData(filterData);
});