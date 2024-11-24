import { writable, derived, get } from "svelte/store";
import { user } from "./user-store";

let getBaseRoutes = (): Route => {

	return {
		title: "Home",
		page: "Home",
		path: "/",
		children: [
			{
				title: "My Feeds",
				page: "MyFeeds",
				path: "/my-feeds",
				children: []
			},
			{
				title: "Account",
				page: "Account",
				path: "/account",
				children: []
			},
			{
				title: "Privacy Policy",
				page: "PrivacyPolicy",
				path: "/privacy-policy",
				isHidden: true,
				children: []
			},
			{
				title: "Terms of Service",
				page: "TermsOfService",
				path: "/terms-of-service",
				isHidden: true,
				children: []
			},
			{
				title: "Admin",
				page: "Admin",
				path: "/admin",
				isAdmin: true,
				isExpanded: undefined,
				children: [
					{
						title: "User Feeds Admin",
						navName: "UserFeeds",
						page: "AdminUserFeeds",
						path: "/admin-user-feeds",
						isAdmin: true
					},
					{
						title: "Feeds Admin",
						navName: "Feeds",
						page: "AdminFeeds",
						path: "/admin-feeds",
						isAdmin: true
					},
					{
						title: "User Admin",
						navName: "Users",
						page: "AdminUsers",
						path: "/admin-users",
						isAdmin: true
					},
					{
						title: "Demonstration Page",
						navName: "Demo",
						page: "AdminDemo",
						path: "/admin-demo",
						isHidden: false,
						isAdmin: true
					},
					{
						title: "Log",
						navName: "Log",
						page: "AdminLog",
						path: "/admin-log",
						isAdmin: true
					}
				]
			}
		]
	};
};

function filterAdminRoutes(node: Route) {
	if (node.children)
		node.children = node.children.filter(a => a.isAdmin !== true).map(a => filterAdminRoutes(a));

	return node;
}



function findRoute(routeRoot: Route, path: string): Route | undefined {
	let cr: Route | undefined;

	function traverse(node: Route): Route | undefined {

		if (node.path === path)
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

	// if (!$user.isAdmin)
	// 	r = filterAdminRoutes(r)

	return r;
});

export const currentPath = writable("/");
export const currentParams = writable<any>({});

export const currentRoute = derived([routes, currentPath], ([$routes, $currentPath]) => {
	let r = findRoute($routes, $currentPath);
	if (r) return r;

	$currentPath = "/";
	return $routes;
});

// Param functions

let paramStringToObj = (inp: string) => {
	let entries = (new URLSearchParams(inp)).entries();
	let p: any = {};
	for (let [key, val] of entries) {
		p[key] = val;
	}
	return p;
};

let objToParamString = (inp: any) => {
	if (!inp) return "";

	let entries = Object.entries(inp);

	if (!entries.length) return "";

	let p = new URLSearchParams();
	for (let [key, val] of entries)
		p.append(key, <string>val);

	return "?" + p.toString();
};

// Public Functions

export const navFromUrl = function () {
	let pathName = window.location.pathname;
	let r = findRoute(get(routes), pathName);

	let p = paramStringToObj(window.location.search);

	if (r) {
		currentPath.set(pathName);
		currentParams.set(p);
		document.title = `TwitFeeder-${r.title}`;
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
	currentPath.set(path);
	currentParams.set(params || {});

	let r = findRoute(get(routes), path);
	if (r) document.title = `TwitFeeder-${r.title}`;
};

// Back Button

window.onpopstate = () => {
	let pathName = window.location.pathname;
	let r = findRoute(get(routes), pathName);

	if (r) {
		currentPath.set(pathName);
	} else {
		window.location.replace(window.location.origin);
	}
};
