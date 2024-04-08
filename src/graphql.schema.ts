
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class LoginInput {
    email: string;
    password: string;
}

export class RegisterInput {
    email: string;
    password: string;
    name: string;
}

export abstract class IQuery {
    abstract ping(): string | Promise<string>;
}

export abstract class IMutation {
    abstract login(loginInput: LoginInput): Nullable<AuthResult> | Promise<Nullable<AuthResult>>;

    abstract register(registerInput: RegisterInput): Nullable<AuthResult> | Promise<Nullable<AuthResult>>;
}

export class AuthResult {
    token: string;
}

type Nullable<T> = T | null;
