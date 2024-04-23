
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

export class CreatePlantInput {
    name: string;
    type: string;
}

export class UpdatePlantInput {
    name?: Nullable<string>;
    type?: Nullable<string>;
}

export abstract class IQuery {
    abstract ping(): string | Promise<string>;

    abstract plants(): Nullable<Plant>[] | Promise<Nullable<Plant>[]>;

    abstract plant(id: string): Nullable<Plant> | Promise<Nullable<Plant>>;
}

export abstract class IMutation {
    abstract login(loginInput: LoginInput): Nullable<AuthResult> | Promise<Nullable<AuthResult>>;

    abstract register(registerInput: RegisterInput): Nullable<AuthResult> | Promise<Nullable<AuthResult>>;

    abstract createPlant(createPlantInput: CreatePlantInput): Plant | Promise<Plant>;

    abstract updatePlant(updatePlantInput: UpdatePlantInput): Plant | Promise<Plant>;

    abstract removePlant(id: number): Nullable<Plant> | Promise<Nullable<Plant>>;
}

export class AuthResult {
    token: string;
}

export class Plant {
    id: string;
    type: string;
    name: string;
    room?: Nullable<Room>;
    notifications?: Nullable<Nullable<Notification>[]>;
    measurements?: Nullable<Nullable<Measurement>[]>;
}

export class Notification {
    id: string;
    message: string;
    date: string;
}

export class Measurement {
    id: string;
    value: number;
    date: string;
}

export class Room {
    id: string;
    name: string;
}

type Nullable<T> = T | null;
