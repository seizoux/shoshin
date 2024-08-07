export {};

export interface Friend {
    avatar: string;
    username: string;
    uid: string;
    bio: string;
    in: any;
    out: any;
}

export interface FriendResponse {
    payload: Friend[];
}

export interface FriendResponseRequests {
    status: string;
    payload: {
        in: Friend[];
        out: Friend[];
    };
}

export interface SearchUser {
    avatar: string;
    username: string;
    bio: string;
    uid: string;
}

export interface SearchResponse {
    payload: SearchUser[];
}

export interface FetchResponseFriends {
    status: string;
    payload: string | boolean;
}

export interface CookieResponse {
    [key: string]: any;
}

export interface UidData {
    expiry: number;
    raw: {
        token: string;
    };
}

export interface FetchResponse {
    payload: boolean;
}

// Type for the mapping objects
export interface Mapping {
    [key: string]: string;
}