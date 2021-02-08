import Vue from 'vue';

// Alter type on refs for using ValidationObserverInstance
export type VForm = (Element | Element[] | Vue | Vue[]) & { validate: () => any, reset: () => any };

export interface IProduct {
  attachments?:	any[];
  createdOn?: string;
  fees?: IFee[];
  id?: number;
  images?: any[];
  inventory?: IInventory[];
  msrp?: number;
  name?: string;
  notes?: INote[];
  org?: IOrganization;
  picture?: IMedia;
  productIdentifiers?:	IProductIdentifier[];
  productItemQuantities?: IProductItemQuantity[];
  status?: IStatus;
  updatedOn?:	string;
}

export interface IInventory {
  available?: number;
  createdOn?:	string;
  id?: number;
  onhand?: number;
  reserved?: number;
  updatedOn?: string;
  warehouse?: IWarehouse;
}

export interface IOrganization {
  address?: IAddress;
  id?: number
  logo?: IMedia;
  name?:	string;
  phone?:	string;
  website?:	string;
}

export interface IMedia {
  createdOn?: string;
  id?:	number;
  name?:	string;
  org?: IOrganization;
  path?:	string;
  updatedOn?: string;
}

export interface IProductIdentifier {
  id?:	number;
  identifier?:	string;
  name?:	string;
  type?:	string;
}

export interface IProductItemQuantity {
  count?: number;
  id?:	number;
  productItem?: IProductItem;
}

export interface IProductItem {
  caseCost?:	number;
  caseQty?: number;
  itemCost?: number;
  createdOn?: string;
  description?: string;
  id?:	number;
  inventory?: IInventory;
  name?:	string;
  notes?: INote[]
  org?: IOrganization;
  picture?: IMedia;
  productIdentifiers?:	IProductIdentifier[];
  supplier?:	ISupplier;
  updatedOn?:	string;
}

export interface IStatus {
  id?:	number;
  name?:	string;
  org?: IOrganization;
  type?: string;
}

export interface ISupplier {
  address?: IAddress;
  createdOn?: string;
  id?: number;
  logo?:	IMedia;
  name?:	string;
  notes?: INote[];
  org?: IOrganization;
  updatedOn?:	string;
}

export interface IUser {
  createdOn?: string;
  firstName?: string;
  id?: number;
  lastName?:	string;
  org?: IOrganization;
  password?:	string;
  picture?: IMedia;
  updatedOn?: string;
  username?:	string;
}

export interface IWarehouse {
  id?:	number;
  location?:	IAddress;
  name?:	string;
  org?: IOrganization;
  warehouseType?: string;
}

export interface INote {
  createdOn?: string;
  description?: string;
  id?: number;
  title?: string;
  updatedOn?: string;
}

export interface IAddress {
  addressLine1?:	string;
  addressLine2?:	string;
  city?:	string;
  country?: string;
  state?: string;
  zipCode?: string;
}

export interface IFee {
  createdOn?: string;
  id?:	number;
  name?:	string;
  org?: IOrganization;
  amount?: number;
  type?: "AMOUNT" | "PERCENTAGE";
  updatedOn?: string;
}

export interface IProductOrder {
  createdOn?: string;
  deliveredOn?:	string;
  fees?: IFee[];
  id?: number;
  internalId?: string;
  notes?: INote[];
  org?: IOrganization;
  productQuantities?: IProductQuantity[];
  status?: IStatus;
  updatedOn?: string;
}

export interface IProductQuantity {
  count?: number;
  id?: number;
  product?: IProduct;
}
