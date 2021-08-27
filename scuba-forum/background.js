const socket = io.connect('http://localhost:4000');

let user = ''
let url = ''

function setUser(userName){
    user = userName
}

chrome.browserAction.onClicked.addListener( async function(tab) {
    chrome.storage.sync.get(['key'], function(result) {
        if(result.key){
            user = result.key
        }
    });

    await chrome.windows.create({
        url: chrome.runtime.getURL('popup.html'),
        type: 'popup',
        width: 200,
        height: 300
    });
})

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    url = tab.url;
    if(url !== '' && url.includes('alura.com.br')) {
        socket.emit('newUrl', user, url);
    }
})

chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function(tab) {
        url = tab.url;
        if(url !== '' && url.includes('alura.com.br')) {
            socket.emit('newUrl', user, url);
        }
    })
})

socket.on('scubas', data => {
    let filterData = data.filter(item => item.url === url)
    chrome.runtime.sendMessage(filterData)
})