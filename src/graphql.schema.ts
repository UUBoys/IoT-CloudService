
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

export class PairPlantInput {
    name: string;
    type: string;
    token: string;
}

export class UpdatePlantInput {
    plantId?: Nullable<string>;
    name?: Nullable<string>;
    type?: Nullable<string>;
}

export class RoomPlantInput {
    plantId: string;
}

export class CreateRoomInput {
    name: string;
    plants?: Nullable<Nullable<RoomPlantInput>[]>;
}

export class AddPlantsToRoomInput {
    roomId: string;
    plants?: Nullable<Nullable<RoomPlantInput>[]>;
}

export class RemovePlantsFromRoomInput {
    roomId: string;
    plants?: Nullable<Nullable<RoomPlantInput>[]>;
}

export abstract class IQuery {
    abstract ping(): string | Promise<string>;

    abstract plants(): Nullable<Plant>[] | Promise<Nullable<Plant>[]>;

    abstract plant(id: string): Nullable<Plant> | Promise<Nullable<Plant>>;

    abstract rooms(): Nullable<Nullable<Room>[]> | Promise<Nullable<Nullable<Room>[]>>;

    abstract room(id: string): Nullable<Room> | Promise<Nullable<Room>>;
}

export abstract class IMutation {
    abstract login(loginInput: LoginInput): Nullable<AuthResult> | Promise<Nullable<AuthResult>>;

    abstract register(registerInput: RegisterInput): Nullable<AuthResult> | Promise<Nullable<AuthResult>>;

    abstract pairPlant(pairPlantInput: PairPlantInput): Plant | Promise<Plant>;

    abstract updatePlant(updatePlantInput: UpdatePlantInput): Plant | Promise<Plant>;

    abstract removePlant(id: number): RemovePlantResponse | Promise<RemovePlantResponse>;

    abstract createRoom(room: CreateRoomInput): Nullable<Room> | Promise<Nullable<Room>>;

    abstract addPlantsToRoom(addPlants: AddPlantsToRoomInput): Nullable<Room> | Promise<Nullable<Room>>;

    abstract removePlantsFromRoom(removePlants: RemovePlantsFromRoomInput): Nullable<Room> | Promise<Nullable<Room>>;

    abstract deleteRoom(roomId: string): Nullable<Room> | Promise<Nullable<Room>>;
}

export class AuthResult {
    token: string;
}

export class Measurement {
    id: string;
    value: number;
    date: string;
}

export class Plant {
    id: string;
    type: string;
    name: string;
    room?: Nullable<Room>;
    lastHeartbeat?: Nullable<string>;
    measurements?: Nullable<Nullable<Measurement>[]>;
}

export class RemovePlantResponse {
    id: string;
    name: string;
    unpaired: boolean;
}

export class Room {
    id: string;
    name: string;
    plants?: Nullable<Nullable<Plant>[]>;
}

type Nullable<T> = T | null;
