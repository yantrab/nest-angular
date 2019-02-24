
import { Module, DynamicModule, Inject, Injectable, Global } from '@nestjs/common';
import { MongoClient, Collection } from 'mongodb';
import { Entity, EntityWithoutGetters } from 'shared';


// tslint:disable-next-line: max-classes-per-file
@Injectable()
export class RepositoryFactory {
    constructor(@Inject('MONGO_CONNECTION') private connection: MongoClient) { }

    getRepository<T extends Entity>(entity: { new(): T; }, db: string) {
        return new Repository(this.connection.db(db).collection<Partial<T>>(entity.name));
    }
}


// tslint:disable-next-line: max-classes-per-file
@Global()
@Module({
    //providers: [RepositoryFactory]
})
export class MongoRepoModule {
    static forRoot(url: string) {
        const connectionProvider = {
            provide: 'MONGO_CONNECTION',
            useFactory: async () => await new MongoClient(url).connect(),
        };
        return {
            module: MongoRepoModule,
            providers: [
                connectionProvider, RepositoryFactory,
            ],
            exports: [connectionProvider, RepositoryFactory],
        };
    }
}



// tslint:disable-next-line: max-classes-per-file
export class Repository<T extends Entity> {
    constructor(public collection: Collection<Partial<EntityWithoutGetters<T>>>) { }
    saveOrUpdate(entity: Partial<EntityWithoutGetters<T>>) {
        this.collection.updateOne({ _id: entity['_id'] }, { $set: entity }, { upsert: true });
    }
}

