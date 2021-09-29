import Dashboard from "./pages/Dashboard.js";
import Posts from "./pages/Posts.js";
//  import PostView from "./pages/PostView.js";
import Settings from "./pages/Settings.js";

// function Settings(){
    
// }

// Settings.prototype.getHtml = function(){
//     return (`
//             <h1>Welcome back, Dom</h1>
//             <p>
//                 Fugiat voluptate et nisi Lorem cillum anim sit do eiusmod occaecat irure do. Reprehenderit anim fugiat sint exercitation consequat. Sit anim laborum sit amet Lorem adipisicing ullamco duis. Anim in do magna ea pariatur et.
//             </p>
//             <p>
//                 <a href="/posts" data-link>View recent posts</a>.
//             </p>
//     `)
// }
console.log(new Settings().getHtml())
const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = match => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]];
    }));
};

const navigateTo = url => {
    history.pushState(null, null, url);
    router();
};

const router = async () => {
    const routes = [
        { path: "/", view: Dashboard },
        { path: "/posts", view: Posts },
        // { path: "/posts/:id", view: PostView },
        { path: "/settings", view: Settings }
    ];

    // Test each route for potential match
    const potentialMatches = routes.map(route => {
        console.log(route)
        console.log(pathToRegex(route.path))
        return {
            route: route,
            result: location.pathname.match(pathToRegex(route.path))
        };
    });

    let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);

    if (!match) {
        match = {
            route: routes[0],
            result: [location.pathname]
        };
    }

    console.log(match)
    console.log(getParams(match))
    const view = new match.route.view(getParams(match));

    document.querySelector("#app").innerHTML = await view.getHtml();
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    const nav = document.querySelector('nav')

    nav.addEventListener("click", e => {

        console.log(e.target.href)
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
    });
    
    router();
});

document.querySelector('#testBtn').addEventListener('click',()=>{
    navigateTo("/posts")
});