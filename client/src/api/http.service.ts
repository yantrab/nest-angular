
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
@Injectable()
export class APIService {
  constructor(private httpClient: HttpClient) { }
  get(url) { return this.httpClient.get(url); }
  post(url, body) { return this.httpClient.post(url, body); }
}
