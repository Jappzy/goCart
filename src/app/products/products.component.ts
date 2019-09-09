import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { ProductsService } from '../services/products.service';
import { CartService } from '../services/cart.service';
import { debounceTime, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {
  quantityOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  searchResults$: Observable<any>;

  searchDebouncer: Subject<string> = new Subject();
  debouncSub: Subscription;

  constructor(
    private productsService: ProductsService,
    private cartService: CartService,
    private router: Router
    ) { }

  ngOnInit() {
    this.debouncSub = this.searchDebouncer
      .pipe(debounceTime(777))
      .subscribe(text => {
        this.searchResults$ = this.productsService.searchProducts(text)
          .pipe(
            map(products => {
              return products.map(product => {
                product.quantity = 1;
                return product;
              });
            })
          );
      });
  }

  ngOnDestroy() {
    if (this.debouncSub) {
      this.debouncSub.unsubscribe();
    }
  }

  onSearchInput(event: any) {
    const text = event.target.value;

    this.searchDebouncer.next(text);
  }

  addToCart(product: any) {
    this.cartService.addProductToCart(product);

    this.router.navigateByUrl('/cart');
  }

}
