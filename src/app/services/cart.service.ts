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
    const cachedCart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : null;

    const startingVal = cachedCart || [];

    this.cart$ = new BehaviorSubject(startingVal);

    if (!cachedCart) {
      this.getInitialCart();
    }
  }

  getInitialCart(): void {
    console.log('getInitialCart');
    let cartProducts = [];

    this.http.get(this.initialCartUrl)
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

      )
      .subscribe(cart => {
        this.cart$.next(cart);

        localStorage.setItem('cart', JSON.stringify(cart));
      });
  }

  updateCartProduct(newProduct: any) {
    const products = this.cart$.getValue();

    const index = products.findIndex(p => p.id === newProduct.id);

    products[index] = newProduct;

    this.cart$.next(products);

    localStorage.setItem('cart', JSON.stringify(products));
  }

  removeCartProduct(productId: string) {
    const products = this.cart$.getValue();

    const index = products.findIndex(p => p.id === productId);

    products.splice(index, 1);

    this.cart$.next(products);

    localStorage.setItem('cart', JSON.stringify(products));
  }
}
