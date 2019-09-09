import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cart: any[];
  quantityOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor(private cartService: CartService) { }

  ngOnInit() {
    this.cartService.getInitialCart().subscribe(cart => {
      this.cart = cart;
    });
  }

}
