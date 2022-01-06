import { writable, derived, get } from "svelte/store";
import { user } from "./user-store";

let getBaseRoutes = (): Route => {

	return {
		title: "Home",
		page: "Home",
		slug: "/",
		children: [
			{
				title: "Botanica Plants",
				page: "Plants",
				slug: "/plants",
				children: []
			},
			{
				title: "Plant Sale Calendar",
				page: "Calendar",
				slug: "/calendar",
				children: []
			},
			{
				title: "More...",
				page: "More",
				slug: "/more",
				isExpanded: undefined,
				children: [
					{
						title: "Interesting Links",
						page: "Links",
						slug: "/links",
						children: []
					},{
						title: "About Botanica",
						page: "About",
						slug: "/about",
						children: []
					},
					{
						title: "Contact Us",
						page: "Contact",
						slug: "/contact",
						children: []
					}
				]
			},
			{
				title: "Shopping List",
				page: "ShoppingList",
				slug: "/shopping-list",
				isHidden: true,
				children: []
			},
			{
				title: "Admin",
				page: "Admin",
				slug: "/admin",
				isAdmin: true,
				isExpanded: undefined,
				children: [
					{
						title: "Plant Admin",
						navName: "Plant Admin",
						page: "PlantAdmin",
						slug: "/plant-admin",
						isAdmin: true
					},
					{
						title: "Plant Availability",
						navName: "Availability",
						page: "PlantAvailability",
						slug: "/plant-availability",
						isAdmin: true
					},
					{
						title: "Calendar Admin",
						navName: "Calendar Admin",
						page: "CalendarAdmin",
						slug: "/calendar-admin",
						isAdmin: true
					},
					{
						title: "Links Admin",
						navName: "Links Admin",
						page: "LinksAdmin",
						slug: "/links-admin",
						isAdmin: true
					},
					{
						title: "Shopping Lists",
						navName: "Shopping Lists",
						page: "ShoppingListAdmin",
						slug: "/shopping-list-admin",
						isAdmin: true
					},
					{
						title: "User Admin",
						navName: "Users",
						page: "UserAdmin",
						slug: "/user-admin",
						isAdmin: true
					}
				]
			}
		]
	};
};

function filterAdminRoutes (node: Route) {
	if (node.children)
		node.children = node.children.filter(a => a.isAdmin !== true).map(a => filterAdminRoutes(a));

	return node;
}



function findRoute(routeRoot: Route, slug: string): Route | undefined {
	let cr: Route | undefined;

	function traverse(node: Route): Route | undefined {

		if (node.slug === slug)
			return node;

		let cr: Route | undefined;

		if (node.children && node.children.length) {
			for (let i = 0; i < node.children.length; i += 1) {
				cr = traverse(node.children[i]);

				if (cr)
					return cr;
			}
		}
	}

	cr = traverse(routeRoot);

	return cr;
}

// Stores

export const routes = derived(user, ($user) => {
	let r = getBaseRoutes();

	if (!$user.isAdmin)
		r = filterAdminRoutes(r)

	return r;
});

export const currentSlug = writable("/");
export const currentParams = writable<any>({});

export const currentRoute = derived([routes, currentSlug], ([$routes, $currentSlug]) => {
	let r = findRoute($routes, $currentSlug);
	if (r) return r;

	$currentSlug = "/";
	return $routes;
});

// Param functions

let paramStringToObj = (inp: string) => {
	let entries = (new URLSearchParams(inp)).entries();
	let p: any = {};
	for(let [key, val] of entries) { 
		p[key] = val; 
	}
	return p;
};

let objToParamString = (inp: any) => {
	if (!inp) return "";

	let entries = Object.entries(inp);

	if (!entries.length) return "";

	let p = new URLSearchParams();
	for(let [key, val] of entries)
		p.append(key, <string>val); 

	return "?" + p.toString();
};

// Public Functions

export const navFromUrl = function () {
	let pathName = window.location.pathname;
	let r = findRoute(get(routes), pathName);

	let p= paramStringToObj(window.location.search);

	if (r) {
		currentSlug.set(pathName);
		currentParams.set(p);
		document.title = `Botanica - ${r.title}`;
	} else {
		window.location.replace(window.location.origin);
	}
};

export const navTo = function (e: MouseEvent | null, path: string, params?: any) {
	e && e.preventDefault();

	//let pathName = e.currentTarget.dataset.dest;
	let url = window.location.origin + path;

	if (params)
		url += objToParamString(params);

	window.history.pushState({}, path, url);
	currentSlug.set(path);
	currentParams.set(params || {});

	let r = findRoute(get(routes), path);
	if (r) document.title = "Botanica - " + r.title;
};

// Back Button

window.onpopstate = () => {
	let pathName = window.location.pathname;
	let r = findRoute(get(routes), pathName);

	if (r) {
		currentSlug.set(pathName);
	} else {
		window.location.replace(window.location.origin);
	}
};
