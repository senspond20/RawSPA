// import Dashboard from "./pages/Dashboard.js";
// import Posts from "./pages/Posts.js";
//  import PostView from "./pages/PostView.js";
// import Settings from "./pages/Settings.js";

/* 추상 View 클래스 */
var AbstractView = (function(){
    function AbstractView(title, param){
        console.log(title,param)
        this.param = param;
        this.title = title;
        document.title = this.title
    }
    AbstractView.prototype.getHtml = function(){ return "dfsfd"}
    AbstractView.prototype.didMount = function(){ return "dfsfd"}
    return AbstractView;
}());

var Dashboard = (function(){
    function Dashboard(title, param){
        AbstractView.call(this,title,param)
    }
        Dashboard.prototype = Object.create(AbstractView.prototype)
        Dashboard.prototype.getHtml = function(){
            return (`
                    <h1>안녕하세요</h1>
            `)
        }
        Dashboard.prototype.didMount = function(){
            document.querySelector('h1').addEventListener('click',()=>alert('hi'))
        }
    return Dashboard;
}());



function Settings(title){
    document.title = title
}

Settings.prototype.getHtml = function(){
    return (`
            <h1>Welcome back, Dom</h1>
            <p>
                Fugiat voluptate et nisi Lorem cillum anim sit do eiusmod occaecat irure do. Reprehenderit anim fugiat sint exercitation consequat. Sit anim laborum sit amet Lorem adipisicing ullamco duis. Anim in do magna ea pariatur et.
            </p>
            <p>
                <a href="/posts" data-link>View recent posts</a>.
            </p>
    `)
}
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
        { path: "/", title : "홈" , view: Dashboard },
        // { path: "/posts", view: Posts },
        // { path: "/posts/:id", view: PostView },
        { path: "/settings",  title : "Setting" , view: Settings }
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
    const route = match.route;

    const view = new route.view(route.title, getParams(match));

    document.querySelector("#app").innerHTML = await view.getHtml();

    await view.didMount();

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