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

    const cachedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

    this.user$ = new BehaviorSubject(cachedUser);
  }

  getInitialCart(): void {
    let cartProducts = [];

    this.http.get(this.initialCartUrl)
      .pipe(

        tap((res: any) => {
          this.user$.next(res.user);
          localStorage.setItem('user', JSON.stringify(res.user));
        }),

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

    const index = products.findIndex(p => p.product_id === newProduct.product_id);

    products[index] = newProduct;

    this.cart$.next(products);

    localStorage.setItem('cart', JSON.stringify(products));
  }

  removeCartProduct(productId: string) {
    const products = this.cart$.getValue();

    const index = products.findIndex(p => p.product_id === productId);

    products.splice(index, 1);

    this.cart$.next(products);

    localStorage.setItem('cart', JSON.stringify(products));
  }

  addProductToCart(product: any) {
    const products = this.cart$.getValue();

    const exists = products.find(p => p.product_id === product.product_id);

    if (!exists) {
      products.push(product);
      console.log('new products', products);
      this.cart$.next(products);
    } else {
      window.alert('That item is already in your cart, silly!');
    }

  }
}
