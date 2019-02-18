import { plainToClass } from "class-transformer";
import { get, post } from "./http.service";

export class AdminController {
    
    async getUsersData(): Promise<any> {
        return new Promise((resolve) => get('rest/admin/').then((data:any) => resolve(data)))
    }
}
