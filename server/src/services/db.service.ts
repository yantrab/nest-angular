import { MongoClient, connect, Db, Collection } from 'mongodb';
import { Entity, EntityWithoutGetters } from 'shared';
import { Injectable } from '@nestjs/common';
import {ReplaySubject} from 'rxjs'
const url = 'mongodb://localhost:27017';

@Injectable()
export class DBService {
    public getConnection: ReplaySubject<DBService> = new ReplaySubject()
    private connection: MongoClient;
    constructor() {
        new MongoClient(url).connect().then(connection => {
            this.connection = connection;
            this.getConnection.next(this)
            console.log("Connected successfully to server");
        }, console.log)
    }

    getRepository<T extends Entity>(entity: { new(): T; }, db: string) {
        return new Repository(this.connection.db(db).collection<Partial<T>>(entity.name))
    }
}

export class Repository<T extends Entity>{
    constructor(public collection: Collection<Partial<EntityWithoutGetters<T>>>) { }
    saveOrUpdate(entity:Partial<EntityWithoutGetters<T>>){
        this.collection.updateOne({_id:entity['_id']},{$set:entity},{upsert:true})
    }
}

