const bgPage = chrome.extension.getBackgroundPage();

function changeValue(values) {

    const scubas = document.querySelector(".scubas");
    const nobody = document.querySelector('.nobody');
    const login = document.querySelector('.login');
    
    const usersList = document.querySelector(".scubas__list");

    usersList.innerHTML = ""

    if (values.length <= 1 && !login.classList.contains('active')) {
      scubas.classList.remove("active");
      nobody.classList.add("active");
      return;
    } else {
      nobody.classList.remove("active");
      scubas.classList.add("active");
    }

    for (let i = 0; i < values.length; i++){
        const name = values[i].name;
        const initial = name[0];
        
        usersList.innerHTML += `<li class="scuba" data-initial=${initial}>${name}</li>`;
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    changeValue(message);
});

document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get(['key'], function(result) {
        if(result.key){
            document.querySelector(".login").classList.remove("active");
            document.querySelector(".nobody").classList.add("active");
            changeValue(bgPage.getScubas());
        }
    })

    let button = document.querySelector(".button-entrar");
    button.addEventListener('click', async () => {
        let userName = document.querySelector('.input-nome').value;

        await chrome.storage.sync.set({key: userName}, function() {
            console.log('Value is set to ' + userName);
        });

        document.querySelector(".login").classList.remove("active");
        document.querySelector(".nobody").classList.add("active");
        bgPage.setUser(userName);
    });
});
