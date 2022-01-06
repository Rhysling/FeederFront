// Using MSBuild ver. 5.0.301 to load projects.
// Generated - 2021/06/24-15:06:49

// SOLUTION: Single Project

// PROJECT SEARCHED:
//	BotanicaStoreBack

type INullable<T> = T | null | undefined;

// NAMESPACE: BotanicaStoreBack.Models

interface ICalendar {
	itemId: number;
	beginDate: string;
	endDate: INullable<string>;
	eventTime: string;
	title: string;
	location: string;
	description: string;
	isSpecial: boolean;
	beginDateFormatted: string;
	endDateFormatted: string;
}

interface IKey {
	keyName: string;
	keyValue: string;
}

interface ILink {
	linkId: number;
	title: string;
	description: string;
	url: string;
	sortOrder: number;
	isDeleted: boolean;
}

interface IPlant {
	plantId: number;
	genus: string;
	species: string;
	common: string;
	description: string;
	webDescription: string;
	plantSize: string;
	plantType: string;
	plantZone: string;
	isNwNative: boolean;
	hasSmallPic: boolean;
	bigPicIds: string;
	isListed: boolean;
	isFeatured: boolean;
	lastUpdate: string;
	flag: string;
	lastUpdateFormatted: string;
}

interface IPlantPrice {
	plantId: number;
	potSizeId: number;
	price: INullable<number>;
	isAvailable: boolean;
}

interface IPotSize {
	id: number;
	potDescription: string;
	potShorthand: string;
	sortOrder: number;
}

interface IvwListedPlant {
	plantId: number;
	genus: string;
	species: string;
	common: string;
	description: string;
	plantSize: string;
	plantType: string;
	plantZone: string;
	isNwNative: boolean;
	hasSmallPic: boolean;
	bigPicIds: string;
	isFeatured: boolean;
	availability: string;
}

interface IvwPlantPriceMatrix {
	potSizeId: number;
	potDescription: string;
	potShorthand: string;
	sortOrder: number;
	plantId: number;
	price: INullable<number>;
	isAvailable: boolean;
}

interface IvwPlantPriceSummary {
	plantId: number;
	genus: string;
	species: string;
	available: string;
	notAvailable: string;
}

interface IvwPlantsAvailable {
	plantId: number;
	plantName: string;
	potSizeId: number;
	potDescription: string;
	potShorthand: string;
	sortOrder: number;
	price: number;
	qtyEntered: string;
	isValid: INullable<boolean>;
}

interface IvwShoppingListItem {
	wlId: number;
	plantId: number;
	plantName: string;
	potSizeId: number;
	potDescription: string;
	sortOrder: number;
	qty: number;
	price: number;
	currentPrice: INullable<number>;
	isCurrentlyAvailable: INullable<boolean>;
}

interface IvwShoppingListSummary {
	wlId: number;
	userId: number;
	createdDate: string;
	lastUpdateDate: string;
	emailedDate: INullable<string>;
	isClosed: boolean;
	userFullName: string;
	email: string;
	totalCount: number;
	totalPretax: number;
	createdDateFormatted: string;
	lastUpdateDateFormatted: string;
	emailedDateFormatted: string;
}

interface IvwUserDetail {
	userId: number;
	email: string;
	fullName: string;
	isAdmin: boolean;
	createdDate: string;
	lastLoginDate: string;
	loginCount: number;
	countAll: number;
	countPending: number;
	countClosed: number;
	createdDateFormatted: string;
	lastLoginDateFormatted: string;
}

interface IvwWishListEmail {
	wlId: number;
	userId: number;
	createdDate: string;
	lastUpdateDate: string;
	emailedDate: INullable<string>;
	isClosed: boolean;
	email: string;
	fullName: string;
	items: Array<IvwWishListEmailItem>;
}

interface IvwWishListEmailItem {
	wlId: number;
	plantId: number;
	plantName: string;
	potSizeId: number;
	potDescription: string;
	price: number;
	qty: number;
}

interface IvwWishListFlat {
	userId: number;
	createdDate: string;
	lastUpdateDate: string;
	emailedDate: INullable<string>;
	isClosed: boolean;
	wlId: number;
	plantId: number;
	plantName: string;
	potSizeId: number;
	potDescription: string;
	sortOrder: number;
	price: number;
	qty: number;
	currentPrice: INullable<number>;
	isCurrentlyAvailable: INullable<boolean>;
	isEditMode: boolean;
}

interface IWishList {
	wlId: number;
	userId: number;
	createdDate: string;
	lastUpdateDate: string;
	emailedDate: INullable<string>;
	isClosed: boolean;
	createdDateFormatted: string;
	lastUpdateDateFormatted: string;
	emailedDateFormatted: string;
}

interface IWishListItem {
	wlId: number;
	plantId: number;
	potSizeId: number;
	price: number;
	qty: number;
}

// NAMESPACE: BotanicaStoreBack.Models.Core

interface INameValueItem {
	name: string;
	value: string;
}

interface IPlantIdName {
	plantId: number;
	plantName: string;
}

interface IPlantPicId {
	plantId: number;
	picId: string;
}

interface IPlantToggle {
	plantId: number;
	val: boolean;
}

interface IUserClient {
	userId: number;
	email: string;
	fullName: string;
	token: string;
	isAdmin: boolean;
	taxRate: number;
}

interface IUserLogin {
	email: string;
	fullName: string;
	pw: string;
}

