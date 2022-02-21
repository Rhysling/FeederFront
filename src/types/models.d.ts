// Using MSBuild ver. 6.0.200 to load projects.
// Generated - 2022/02/20-14:19:49

// SOLUTION: FeederBack

// PROJECTS SEARCHED:
//	FeederBack
//	FeederBack.Common
//	FeederBack.Ops
//	FeederBack.Db

type INullable<T> = T | null | undefined;

// NAMESPACE: FeederBack.Common.Models

interface IEditPropertyRequest {
	objectId: INullable<string>;
	propName: INullable<string>;
	value: INullable<string>;
}

interface IEditResponse {
	isSuccess: boolean;
	message: string;
}

interface IFeed {
	_id: string;
	_rev: INullable<string>;
	tbl: string;
	feedType: string;
	feedId: string;
	title: INullable<string>;
	description: INullable<string>;
	link: INullable<string>;
	lastBuildDate: string;
	language: INullable<string>;
	category: INullable<string>;
	postItems: Array<IPostItem>;
	lastSave: string;
	lastPostKey: string;
	isUpdating: boolean;
	isActive: boolean;
	exists: boolean;
}

interface IKVP {
	key: string;
	value: string;
	sortSeq: number;
}

interface ILogItemOut {
	_id: string;
	_rev: INullable<string>;
	tbl: string;
	eventTimestamp: INullable<string>;
	eventDateGmt: INullable<string>;
	levelName: INullable<string>;
	levelId: number;
	appName: INullable<string>;
	message: INullable<string>;
	isException: boolean;
	infoObj: any;
	eventDatePT: string;
	eventDateGmtShort: string;
	infoObjDisplay: string;
}

interface IPostItem {
	_id: string;
	_rev: INullable<string>;
	tbl: string;
	feedType: string;
	feedId: string;
	postKey: string;
	postUnixDate: number;
	title: INullable<string>;
	description: INullable<string>;
	link: INullable<string>;
	guid: INullable<string>;
	pubDateGmt: INullable<string>;
}

// NAMESPACE: FeederBack.Models

interface IAdminLogSearchVM {
	asOfDate: string;
	takeCount: number;
	isAllForDate: boolean;
}

interface IAdminLogVM {
	searchCriteria: INullable<IAdminLogSearchVM>;
	logItems: INullable<Array<ILogItemOut>>;
}

interface ILookupFeedVM {
	feedTypeSL: Array<IKVP>;
	feedType: string;
	screenName: string;
	resultMessage: string;
	newFeed: IFeed;
	hasNewFeed: boolean;
	isReset: boolean;
}

interface IManageMyFeedsVM {
	userSL: Array<IKVP>;
	userId: string;
	userDetail: IUserDetailVM;
	lookupFeed: ILookupFeedVM;
	urlRoot: string;
	myId: string;
	isAdmin: boolean;
}

interface IUserDetailVM {
	userInfo: any;
	isMe: boolean;
	feeds: Array<IFeed>;
}

