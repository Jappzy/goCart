import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cart$: Observable<any>;
  user$: Observable<any>;

  quantityOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  subtotal: number;
  discount: number;
  total: number;

  constructor(private cartService: CartService) { }

  ngOnInit() {
    this.user$ = this.cartService.user$.asObservable();

    this.cart$ = this.cartService.cart$.asObservable()
      .pipe(
        tap(products => {

          this.subtotal = products.reduce((acc, val) => acc + (val.price * val.quantity), 0);

          this.total = products.reduce((acc, val) => {
            const price = val.credit_coupon_price || val.price;
            return acc + (price * val.quantity);
          }, 0);

        })
      );
  }

  updateProduct(product: any) {
    this.cartService.updateCartProduct(product);
  }

  removeProduct(productId: string) {
    this.cartService.removeCartProduct(productId);
  }

  resetCart() {
    this.cartService.getInitialCart();
  }

}
