import { Component, inject, OnInit, effect } from '@angular/core';
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
import { CartService } from '../../../core/services/cart.service';
import { signal, computed } from '@angular/core';

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
  private cartService = inject(CartService);

  product$!: Observable<Product | undefined>;
  quantity = signal(1);
  quantityInCart = computed(() => {
    const product = this.product()?.id;
    const cartItems = this.cartService.cart()?.items ?? [];
    return product ? cartItems.find(x => x.productId === product)?.quantity ?? 0 : 0;
  });
  product = signal<Product | undefined>(undefined);

  constructor() {
    effect(() => {
      const product = this.product();
      if (product) {
        this.quantity.set(this.quantityInCart());
      }
    });
  }

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.product$ = this.shopService.getProduct(+id);
      this.product$.subscribe(product => {
        this.product.set(product);
        this.quantity.set(1); 
      });
    } else {
      this.product$ = of(undefined);
    }
  }

  updateCart() {
    const product = this.product();
    if (!product) return;

    const currentQuantity = this.quantityInCart();
    const newQuantity = this.quantity();

    if (newQuantity > currentQuantity) {
      this.cartService.addItemToCart(product, newQuantity - currentQuantity);
    } else if (newQuantity < currentQuantity) {
      this.cartService.removeItemFromCart(product.id, currentQuantity - newQuantity);
    }
  }

  getButtonText() {
    return this.quantityInCart() > 0 ? 'Update cart' : 'Add to cart';
  }
}