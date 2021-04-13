// actions
export const USER_INVITE = 'USER_INVITE';
export const USER_SEARCH = 'USER_SEARCH';
export const USERS_FETCH_ALL = 'USERS_FETCH_ALL';
export const USERS_FETCH_ONE = 'USERS_FETCH_ONE';
export const USER_ASSIGN_EQUIPMENT = 'PROFILE_ASSIGN_EQUIPMENT';
export const USER_REMOVE_EQUIPMENT = 'PROFILE_REMOVE_EQUIPMENT';
export const USER_ROLES_FETCH = 'USER_ROLES_FETCH';
export const USER_ROLE_ASSIGN = 'USER_ROLE_ASSIGN';
export const USER_ROLE_DISCHARGE = 'USER_ROLE_DISCHARGE';
export const USER_PROPERTY_TYPE_COMMIT = 'USER_PROPERTY_TYPE_COMMIT';
export const USER_PROPERTY_TYPES_FETCH_ALL = 'USER_PROPERTY_TYPES_FETCH_ALL';
export const USER_PROPERTIES_FETCH_ALL = 'USER_PROPERTIES_FETCH_ALL';
export const USER_PROPERTY_COMMIT = 'USER_PROPERTY_COMMIT';
export const USER_PROPERTY_DELETE = 'USER_PROPERTY_DELETE';
export const USER_PROPERTY_TYPE_DELETE = 'USER_PROPERTY_TYPE_DELETE';
export const USER_PROPERTY_TYPES_REMOVE_ONE = 'USER_PROPERTY_TYPES_REMOVE_ONE';

// setters
export const USERS_SET_ALL = 'USERS_SET_ALL';
export const USERS_SET_ONE = 'USERS_SET_ONE';
export const USER_ROLES_SET_ALL = 'USER_ROLES_SET_ALL';
export const USER_PROPERTY_TYPES_SET_ONE = 'USER_PROPERTY_TYPES_SET_ONE';
export const USER_PROPERTY_TYPES_SET_ALL = 'USER_PROPERTY_TYPES_SET_ALL';

// getters
export const USERS_GET_ALL = 'USERS_GET_ALL';
export const USERS_GET_ALL_LIST = 'USERS_GET_ALL_LIST';
export const USERS_GET_ONE = 'USERS_GET_ONE';
export const USER_ROLES_GET_ALL = 'USER_ROLES_GET_ALL';
export const USER_PROPERTY_TYPES_GET_ALL = 'USER_PROPERTY_TYPES_GET_ALL';

// UserRoles //
//////////////

export type UserRoleName =
  | ''
  | 'CanEditEquipment'
  | 'CanEditEquipmentOwner'
  | 'CanEditEquipmentType'
  | 'CanEditRoles'
  | 'CanEditEvent'
  | 'CanEditEventType'
  | 'CanInviteToSystem'
  | 'CanDeleteEventRole';

export class UserRoleDefault {
  public id: string = '';
  public name: UserRoleName = '';
}

export interface IUserRole extends UserRoleDefault {}

// UserPropertyType //
/////////////////////

export class UserPropertyTypeDefault {
  public id: string = '';
  public title: string = '';
  public description: string = '';
  public instancesCount: number = 0;
  public isLocked: boolean = false;
}

export interface IUserPropertyType extends UserPropertyTypeDefault {}

// UserProperty //
/////////////////

export class UserPropertyDefault {
  public value: string = '';
  public status: string = '';
  public userPropertyType: IUserPropertyType = new UserPropertyTypeDefault();
}

export interface IUserProperty extends UserPropertyDefault {}

// User //
/////////

export class UserDefault {
  public id: string = '';
  public firstName: string = '';
  public lastName: string = '';
  public email: string = '';
  public middleName: string = '';
  public phoneNumber: string = '';
  public properties?: IUserProperty[];
  public vkData: string = '';
}

export interface IUser extends UserDefault {}

// UserList //
/////////////

export class UserList {
  public text: string = '';
  public value: string = '';
}

export interface IUserList extends UserList { }

// State //
//////////

export interface IUsersState {
  users: IUser[];
  userRoles: IUserRole[];
  userPropertyTypes: IUserPropertyType[];
}
