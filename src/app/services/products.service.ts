import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  productsUrl = 'https://prodcat.gopuff.com/api/products?location_id=-1';

  constructor(private http: HttpClient) { }

  getProductInfoByIds(ids: string[]): Observable<any> {
    const qs = '&product_ids=' + ids.join(',');

    const url = this.productsUrl + qs;

    return this.http.get(url)
      .pipe(
        map((res: any) => res.products)
      );
  }

  searchProducts(text: string): Observable<any> {
    const qs = `&text=${text}`;

    const url = this.productsUrl + qs;

    return this.http.get(url)
      .pipe(
        map((res: any) => res.products)
      );
  }
}
