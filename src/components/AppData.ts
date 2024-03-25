import { Model } from './base/Model';
import {
	ILotItem,
	IOrder,
	FormErrors,
	IAppState,
	PaymentMethod,
	IBasketItem,
} from '../types/index';
import { IEvents } from './base/events';

export type CatalogChangeEvent = {
	catalog: LotItem[];
};

export class LotItem extends Model<ILotItem> {
	id: string;
	description?: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
	Button: boolean;
}

export class AppState extends Model<IAppState> {
	basket: IBasketItem[] = [];
	catalog: ILotItem[] = [];
	order: IOrder = {
		email: '',
		phone: '',
		address: '',
		items: [],
		total: 0,
		payment: 'card',
	};
	preview: string;
	formErrors: FormErrors = {};

	setPreview(item: ILotItem) {
		this.preview = item.id;
		this.emitChanges('preview:open', item);
	}

	addLot(lot: IBasketItem): void {
		this.basket.push(lot);
		this.emitChanges('basketContent:changed');
	}

	removeLot(id: string): void {
		this.basket = this.basket.filter((lot) => lot.id !== id);
		this.emitChanges('basketContent:changed');
	}

	clearOrder(): void {
		this.order = {
			email: '',
			phone: '',
			address: '',
			items: [],
			total: 0,
			payment: 'card',
		};
	}

	clearBasket(): void {
		this.basket.length = 0;
		console.log('clearBasket: ' + this.basket);
		this.emitChanges('basketContent:changed');
	}

	getTotal(): number {
		return this.basket.reduce((total, amount) => {
			return total + amount.price;
		}, 0);
	}

	setCatalog(items: LotItem[]): void {
		this.catalog = items.map((item) => new LotItem(item, this.events));
		this.emitChanges('lots:show', { catalog: this.catalog });
	}

	setBasket(): IBasketItem[] {
		return this.basket;
	}

	checkBasket(item: IBasketItem): boolean {
		return this.basket.includes(item);
	}

	setOrder(): void {
		this.order.total = this.getTotal();
		this.order.items = this.setBasket().map((item) => item.id);
	}

	setPayField(value: PaymentMethod): void {
		console.log(value);
		this.order.payment = value;
		this.checkDeliveryValidation();
	}

	setAddressField(value: string): void {
		this.order.address = value;
		this.checkDeliveryValidation();
	}

	setOrderFormField(
		field: keyof Pick<IOrder, 'email' | 'phone'>,
		value: string
	): void {
		this.order[field] = value;
		if (this.validateContactsForm()) {
			this.events.emit('order:ready', this.order);
		}
	}

	checkDeliveryValidation(): void {
		if (this.validateDeliveryForm()) {
			this.events.emit('order:ready', this.order);
		}
	}

	validateDeliveryForm(): boolean {
		const errors: typeof this.formErrors = {};
		if (!this.order.payment) {
			errors.payment = 'Выберите метод оплаты';
		}
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		this.formErrors = errors;
		this.events.emit('deliveryErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateContactsForm(): boolean {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.formErrors = errors;
		this.events.emit('contactsErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}
