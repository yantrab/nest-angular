import { plainToClass } from "class-transformer";
import { APIService } from "./http.service";
import { Injectable } from "@angular/core";

@Injectable()
export class AdminController {
    
    async getUsersData(): Promise<any> {
        return new Promise((resolve) => this.api.get('rest/admin/').subscribe((data:any) => resolve(data)))
    }
    constructor(private readonly api: APIService) {
    }
}
