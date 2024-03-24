import { Form } from './common/Form';
import { IOrderForm } from '../types';
import { EventEmitter, IEvents } from './base/events';

export class Order extends Form<IOrderForm> {
	protected _buttons: HTMLButtonElement[];
	protected _button: HTMLButtonElement[];

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._buttons = Array.from(container.querySelectorAll('.button_alt'));
		this._buttons.forEach((button) => {
			button.addEventListener('click', () => {
				this.setPayment(button.name);
				events.emit('setPayment:changed', { name: button.name });
			});
		});
		this.setPayment('card');
	}

	setPayment(name: string) {
		this._buttons.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name === name);
		});
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}
