const main = document.querySelector('main');
const imageUrl = 'https://cmgt.hr.nl:8000/';

let online = window.navigator.onLine;

window.addEventListener('load', e => {
  loadShowcases();
  if('serviceWorker' in navigator) {
    try {
      navigator.serviceWorker.register('sw.js');
      console.log(`SW registered`)
    } catch (error) {
      console.log(`SW registration failed`);
    }
  }
  
  if (!window.indexedDB) {
    console.log("Your browser does not support IndexedDB");
  }else{
    console.log("Your browser supports IndexedDB")
  }

  if(navigator.onLine) {
    console.log("lmao")
    loadTags();
  }

});

async function loadShowcases() {
  const res = await fetch(`https://cmgt.hr.nl:8000/api/projects/`);
  const json = await res.json();

  main.innerHTML = json.projects.map(createProject).join('\n');
}

async function loadTags() {
  try {
    const res = await fetch("https://cmgt.hr.nl:8000/api/projects/tags/");
    const data = await res.json();
    let tags = data.tags;

    var text = "";

      for (let i = 0; i < tags.length; i++) {
        text += `<div class="tag">
                  <span class="tag-text">${data.tags[i]}</span>
                 </div>`;
      }
      document.querySelector(".status-tags").innerHTML = text;
  } catch (error) {
    console.log("Network only resource failed to load");
    document.querySelector(".status-tags").innerHTML = "It seems the app is offline, sadlife";
  }
}

function createProject(project) {
  return `<div class="container">
          <div class="card-panel recipe white row">
            <div class="project">
              <div>
                <h2>${project.title}</h2>
                <img src="https://cmgt.hr.nl:8000/${project.headerImage}">
                <p>${project.description}</p>
                <hr/>
                <p class="blue-text">${project.tags}</p>
              </div>
            </div>
          </div>
        </div>`
  
}