import { IBasketItem } from '../types';
import { View } from './base/View';
import { ensureElement } from '../utils/utils';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}
export class BasketItem extends View<IBasketItem> {
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _index: HTMLElement;

	constructor(index: number, container: HTMLElement, actions?: ICardActions) {
		super(container);
		this._title = ensureElement<HTMLElement>('card__title', container);
		this._price = ensureElement<HTMLElement>('card__price', container);
		this._index = ensureElement<HTMLElement>('basket__item-index', container);
		this._button.addEventListener('click', actions.onClick);
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set price(value: number) {
		this.setText(this._price, value + ' синапсов');
	}

	set index(index: number) {
		this.setText(this._index, index + 1);
	}
}
