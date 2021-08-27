const bgPage = chrome.extension.getBackgroundPage();

function changeValue(values){
    let lista = document.getElementById("usuarios");

    lista.innerHTML = "";

    for(let i = 0; i < values.length; i++){
        lista.innerHTML += `<h3>${values[i].name}</h3>`;
    }
}


// listen for messages from the background page
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    changeValue(message);
});


function saveName(){
    let userName = document.getElementById("userName").value;
    
    chrome.storage.sync.set({name: userName}, function() {
        console.log('Value is set to ' + userName);
    });
    document.getElementById('login').style.display = 'none';
}


// wait to dom to be loaded
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get(['key'], function(result) {
        console.log(result.key)
        if(result.key){
            document.getElementById('login').style.display = 'none';
        }
    });

    let button = document.getElementById("buttonSave");

    button.addEventListener('click', async function() {
        let userName = document.getElementById("userName").value;
    
        await chrome.storage.sync.set({key: userName}, function() {
            console.log('Value is set to ' + userName);
        });

        document.getElementById('login').style.display = 'none';
        bgPage.setUser(userName);
    });
});