
(()=>{

const root = document.body.parentElement;
const next = document.getElementById("next");
const header = document.getElementById("header");
const sheet1 = document.getElementById("sheet1");
const sheet2 = document.getElementById("sheet2");
const sheet3 = document.getElementById("sheet3");

const profileName = document.getElementById("profile_name");
const profileImage = document.getElementById("profile_image");

const statsRepoCount = document.getElementById("stats_repo_count");
const statsLanguage = document.getElementById("stats_language");
const statsStars = document.getElementById("stats_stars");

const smartGridProjects = document.getElementById("smart_grid_projects");




function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


window.addEventListener("scroll", ()=>{
    let scrollMaxY = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (scrollMaxY == window.scrollY){
        next.className = "hidden";
    }
    else{
        next.className = "";
    }
});


const setView = (view) => {
    root.setAttribute("view", view);
}


const hideLoading = async (startWith="products") => {
    setView("loading_done");
    await sleep(900);
    setView("loading_psudo_hide");
    await sleep(1000);
    setView(startWith);
}

const getOffset = (element) => {
    const rect = element.getBoundingClientRect();
    const offsetTop = rect.top + window.scrollY;
    const offsetLeft = rect.left + window.scrollX;
    return { offsetTop, offsetLeft };
}


const addProject = (name, description, webUrl, cloneUrl, topics, stars, watchers, license) => {
    let p = document.createElement("div");
    p.className = "project";
    let html = `
<div class="dottie"></div>
<div class="vlayout">
    <a target="_blank" class="t" href="${webUrl}">${name}</a>
    <a target="_blank" class="clone" href="${cloneUrl}"><svg><use href="#clone_svg"></use></svg></a>
</div>
<div class="d">${description}</div>
<div class="vlayout stats">
<div class="stat"><svg><use href="#star_svg"></use></svg><div class="name">${stars}</div></div>
<div class="stat"><svg><use href="#eye_svg"></use></svg><div class="name">${watchers}</div></div>
<div class="stat"><svg><use href="#license_svg"></use></svg><div class="name">${license?.name|| "UNK"}</div></div>
</div>
    `;

    p.innerHTML = html;
    smartGridProjects.appendChild(p);

    let dot = p.getElementsByClassName("dottie")[0];
    let lastPageY = 0;
    let lastPageX = 0;
    let lastScrollY = 0;
    function onMouseMove(e) {
        let offsets = getOffset(p);
        dot.style.left = `${e.pageX - offsets.offsetLeft - 20}px`;
        dot.style.top = `${e.pageY - offsets.offsetTop - 20}px`;
        lastPageY = e.pageY;
        lastPageX = e.pageX;
        lastScrollY = window.scrollY;
    }
    function onScroll() {
        let offsets = getOffset(p);
        dot.style.left = `${lastPageX - offsets.offsetLeft - 20}px`;
        dot.style.top = `${lastPageY+(window.scrollY - lastScrollY) - offsets.offsetTop - 20}px`;
    }
    window.addEventListener("pointermove", onMouseMove);
    window.addEventListener("scroll", onScroll);
    
}


async function animateSkills(){
    const elems = document.querySelectorAll(".animated_skill");
    while (true){
        await sleep(5000);
        elems.forEach((e)=>{
            e.classList.remove("animated_skill");
        });
        await sleep(1000);
        elems.forEach((e)=>{
            e.classList.add("animated_skill");
        });
    }
}

function loadProfile(username){
    fetch(`https://api.github.com/users/${username}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        profileName.textContent = data.name;
        profileName.href = data.html_url;
        profileImage.src = data.avatar_url;
        statsRepoCount.textContent = data.public_repos;
        console.log(data);
    })
    .catch(error => {
        console.error(error);
    });
}
function loadReposInfo(username){
    // https://api.github.com/users/sudoerr/repos?per_page=100&page=1
    fetch(`https://api.github.com/users/${username}/repos?per_page=100&page=1`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        let languages = {};
        let stars = 0;

        for (let repo of data){
            stars += repo.stargazers_count;
            if (Object.keys(languages).includes(repo.language)){
                languages[repo.language] += 1;
            }
            else{
                languages[repo.language] = 1;
            }
            addProject(
                repo.name,
                repo.description,
                repo.html_url,
                repo.clone_url,
                repo.topics,
                repo.stargazers_count,
                repo.watchers_count,
                repo.license
            );
        }

        let language = Object.entries(languages).reduce((max, current) => {
            return current[1] > max[1] ? current : max;
        })[0];
        statsStars.textContent = `${stars}`;
        statsLanguage.textContent = language;
        hideLoading("all");
    })
    .catch(error => {
        console.error(error);
    });
}


function main(){
    animateSkills();
    loadProfile("sudoerr");
    loadReposInfo("sudoerr");
}
main();
})();