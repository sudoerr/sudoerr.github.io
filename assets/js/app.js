
(()=>{

const next = document.getElementById("next");
const header = document.getElementById("header");
const sheet1 = document.getElementById("sheet1");
const sheet2 = document.getElementById("sheet2");
const sheet3 = document.getElementById("sheet3");



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
})


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
animateSkills();

})();