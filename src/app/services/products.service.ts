import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  productsUrl = 'https://prodcat.gopuff.com/api/products?location_id=-1';

  constructor(private http: HttpClient) { }

  getProductInfoByIds(ids: string[]) {
    const qs = '&product_ids=' + ids.join(',');

    const url = this.productsUrl + qs;

    // const url = 'https://prodcat.gopuff.com/api/products?location_id=-1&product_ids=989,1068';

    return this.http.get(url)
      .pipe(
        map((res: any) => res.products)
      );
  }
}
