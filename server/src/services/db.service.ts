import { MongoClient, connect, Db, Collection} from 'mongodb';
import { Entity } from '../../../shared';
import { Injectable } from '@nestjs/common';
import {equal} from 'assert'
const url = 'mongodb://localhost:27017';


export declare type FindConditions<T> = {
    [P in keyof T]?: T;
};


@Injectable()
export class DBService {
    private connection:MongoClient;
    constructor(){
        new MongoClient(url).connect().then(err => {
           // equal(null, err);
            console.log("Connected successfully to server");
        })
    }

    getRepository<T extends Entity>(entity: { new(): T; },db:string) {

        return this.connection.db(db).collection<FindConditions<T>>(entity.name)
    }
}

export {Collection as Repository} from  'mongodb'
