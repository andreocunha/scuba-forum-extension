let scubas = [];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const topic = document.querySelector(".banner-wrapper");
  const token = document.querySelector(".token");
  scubas = message;

  if (scubas.length > 1 && !token) {
    const token = `<article class="token active">
        <img src="https://i.ibb.co/X2GJ9y6/whh-radar.png" alt="Radar" />
        <p>Outras pessoas estão nesse tópico!</p>
        </article>`;

    topic.innerHTML += token;
  } else if (scubas.length > 1 && token) {
      token.classList.add("active");
  }

  if (scubas.length === 1 && token) {
    token.classList.remove("active");
  }
})
