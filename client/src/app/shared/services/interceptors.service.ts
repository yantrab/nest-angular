import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class InterceptorsService implements HttpInterceptor {
    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const proxyReq = req.clone({ url: `https://localhost:3000/${req.url}` });
        // const proxyReq = req.clone({ url: `https://arkadiy-8:3000/${req.url}` });
        return next.handle(proxyReq);
    }
}
