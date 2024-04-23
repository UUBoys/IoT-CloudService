interface JWTUser {
    uuid: string,
    email: string,
    sub: string,
    iat?: number,
    exp?: number
}
