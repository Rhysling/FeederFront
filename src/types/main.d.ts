type Route = {
  title: string;
  navName?: string;
  page: string;
  slug: string;
  isAdmin?: boolean;
  isHidden?: boolean;
  isExpanded?: boolean;
  children?: Route[];
};


type UserClient = {
  userId: number;
  email: string;
  fullName: string;
  token: string;
  isAdmin: boolean;
  taxRate: number;
};

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

type PageState = {
  itemsPerPage: number;
  itemCount: number;
  currentPage: number;
  startIndex: number;
  endIndex: number;
};

type PlantToggle = {
  plantId: number;
  val: boolean;
  column?: "isListed" | "isFeatured"
};

type PlantPriceMatrix = {
	potSizeId: number;
	potDescription: string;
	potShorthand: string;
	plantId: number;
	price: string | null;
	isAvailable: boolean;
};

type PlantListFilterType = {
	filterText: string;
  isNwNativeOnly: boolean;
  includeNotAvailable: boolean;
};

interface ILinkEdit extends ILink {
  sortOrderEntered: string;
}