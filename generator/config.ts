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
import { map, catchError } from 'rxjs/operators';
import { denormalize } from 'nosql-normalizer';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
@Injectable()
export class APIService {
  constructor(private httpClient: HttpClient, private router: Router) { }
  handleError(error) {
    let errorMessage = '';
    if (error.status === 403) {
      return this.router.navigate(['/login' + window.location.pathname, {}]);
    }
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = 'Error:' + error.error.message;
    } else {
      // server-side error
      errorMessage = 'Error Code:' + error.status + 'Message:' + error.message;
    }
    return throwError(errorMessage);
  }

  get(url) {
    return this.httpClient.get(url, { withCredentials: true })
      .pipe(catchError(this.handleError), map(result => denormalize(result)));
  }
  post(url, body) {
    return this.httpClient.post(url, body, { withCredentials: true })
      .pipe(catchError((err) => this.handleError(err)), map(result => denormalize(result)));
  }
}

`;
