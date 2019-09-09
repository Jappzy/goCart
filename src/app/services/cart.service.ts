import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ProductsService } from './products.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  initialCartUrl: string = 'http://gopuff-public.s3.amazonaws.com/dev-assignments/product/order.json';

  cart$: BehaviorSubject<any>;

  user$: BehaviorSubject<any>;

  constructor(private http: HttpClient, private productsService: ProductsService) {
    // const cachedCart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : null;


    // if (cachedCart) {
    //   this.cart$ = new BehaviorSubject(cachedCart);
    // } else {
    //   this.getInitialCart()
    //     .subscribe(cart => this.cart$ = new BehaviorSubject(cart));
    // }
  }

  getInitialCart(): Observable<any> {
    let cartProducts = [];

    return this.http.get(this.initialCartUrl)
      .pipe(

        map((res: any) => res.cart.products),

        tap(products => cartProducts = products),

        switchMap(products => {

          const ids = products.map(product => product.id);

          return this.productsService.getProductInfoByIds(ids);
        }),

        map(productDetails => {
          return cartProducts.map(product => {
            const details = productDetails.find(data => data.product_id === product.id);
            return { ...details, ...product };
          });
        })

      );
  }
}
