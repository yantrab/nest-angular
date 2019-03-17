export const clientPath = './client/src/api/';
export const serverPath = './server/src';
export const modelsPath = './shared/models';
export const decorators = {
  Get: `
    return new Promise((resolve) => {
      this.api.get('{url}')
      .subscribe((data: any) => {resolve});
});
`,
  Post: `
    return new Promise((resolve) => {
      this.api.post('{url}'{body})
      .subscribe((data: any) => {resolve});
})`,
};
export const httpServiceTemplate = `

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { denormalize } from 'nosql-normalizer';
@Injectable()
export class APIService {
  constructor(private httpClient: HttpClient) { }
  get(url) { return this.httpClient.get(url).pipe(map(result => denormalize(result))); }
  post(url, body) { return this.httpClient.post(url, body).pipe(map(result => denormalize(result))); }
}

`;
