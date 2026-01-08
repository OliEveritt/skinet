import { Component, inject, OnInit } from '@angular/core';
import { ShopService } from '../../../core/services/shop.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../shared/models/product';
import { NgIf, CurrencyPipe, AsyncPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatDivider } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    CurrencyPipe,
    MatIcon,
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    MatDivider,
    FormsModule
  ],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  private shopService = inject(ShopService);
  private activatedRoute = inject(ActivatedRoute);

  product$!: Observable<Product | undefined>;
  quantity = 1;

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.product$ = this.shopService.getProduct(+id);
    } else {
      this.product$ = of(undefined);
    }
  }
}
