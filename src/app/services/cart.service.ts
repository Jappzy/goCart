import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  initialCartUrl: string = 'http://gopuff-public.s3.amazonaws.com/dev-assignments/product/order.json';

  cart$: BehaviorSubject<any>;

  user$: BehaviorSubject<any>;

  constructor(private http: HttpClient) {
    // const cachedCart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : null;


    // if (cachedCart) {
    //   this.cart$ = new BehaviorSubject(cachedCart);
    // } else {
    //   this.getInitialCart()
    //     .subscribe(cart => this.cart$ = new BehaviorSubject(cart));
    // }
  }

  getInitialCart(): Observable<any> {
    return this.http.get(this.initialCartUrl)
      .pipe(
        map((res: any) => res.cart.products)
      );
  }
}
