
(()=>{

const main = document.getElementById("main");
const home = document.getElementById("home");
const projects = document.getElementById("projects");
const contact = document.getElementById("contact");


home.addEventListener("click", ()=>{
    main.className = "main home";
});
projects.addEventListener("click", ()=>{
    main.className = "main projects";
});
contact.addEventListener("click", ()=>{
    main.className = "main contact";
});


})();