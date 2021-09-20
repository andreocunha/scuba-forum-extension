// const socket = io.connect('http://localhost:4000');
const socket = io.connect('https://scuba-radar-api.herokuapp.com');

let user = ''
let url = ''
let currentTabId = 0
let scubas = []

function setUser(userName){
    user = userName
}

function getScubas(){
    return scubas;
}

function getStorageUser(){
    chrome.storage.sync.get(['key'], function(result) {
        if(result.key){
            setUser(result.key)
        }
    })
}

// chrome.browserAction.onClicked.addListener( async function(tab) {
//     await chrome.windows.create({
//         url: chrome.runtime.getURL('popup.html'),
//         type: 'popup',
//         width: 500,
//         height: 750
//     });
// })

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if(changeInfo.status == 'complete' && user === ''){
        getStorageUser();
    }
    
    if (changeInfo.status == 'complete' && user !== '' && !tab.url.includes('chrome-extension')) {
        url = tab.url;
        currentTabId = tabId;

        if(user !== ''){
            if(tab.url.includes('alura.com.br')){
                socket.emit('newUrl', user, tab.url);
            }
            else {
                url = ''
                socket.emit('newUrl', user, url);
            }
        }
    }
})

chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function(tab) {
        if(tab?.pendingUrl?.includes('chrome-extension')){
            return;
        }

        if(user === ''){
            getStorageUser();
        }

        url = tab.url;
        currentTabId = activeInfo.tabId;

        if(user !== ''){
            if(url.includes('alura.com.br')) {
                socket.emit('newUrl', user, url);
            }
            else {
                url = ''
                socket.emit('newUrl', user, url);
            }    
        }
    })
})

socket.on('scubas', data => {
    let filterData = data.filter(item => item.url === url && url.includes('alura.com.br'))
    scubas = filterData;
    chrome.runtime.sendMessage(filterData);
    chrome.tabs.sendMessage(currentTabId, filterData);
})
