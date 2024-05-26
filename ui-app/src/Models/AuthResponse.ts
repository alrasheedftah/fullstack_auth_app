export type AuthTokenResponse = {
    email : string;
    token: string;
};

export type UserModel = {
    email : string;
    password : string;
}

export type UserSignupModel = UserModel & {
    username : string
}