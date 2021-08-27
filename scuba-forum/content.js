const bgPage = chrome.extension.getBackgroundPage();

function changeValue(values){
    let usersList = document.getElementById("users");

    usersList.innerHTML = "";

    for(let i = 0; i < values.length; i++){
        let user = values[i].name;
        let userElement = document.createElement("li");
        userElement.innerHTML = user;
        usersList.appendChild(userElement);
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    changeValue(message);
});

document.addEventListener('DOMContentLoaded', () => {

    chrome.storage.sync.get(['key'], function(result) {
        if(result.key){
            document.getElementById('login').style.display = 'none';
        }
    })

    let button = document.getElementById("buttonSave");
    button.addEventListener('click', async () => {
        let userName = document.getElementById("userName").value;

        await chrome.storage.sync.set({key: userName}, function() {
            console.log('Value is set to ' + userName);
        });

        document.getElementById('login').style.display = 'none';
        bgPage.setUser(userName);
    });
});