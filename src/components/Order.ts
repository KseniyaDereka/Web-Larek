import {Form} from "./common/Form";
import {IOrderForm} from "../types";
import {EventEmitter, IEvents} from "./base/events";
import {ensureElement} from "../utils/utils";

export class Order extends Form<IOrderForm> {
    protected _buttons: HTMLButtonElement[];
    
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this._buttons = Array.from (container.querySelectorAll('.button_alt'));
       this._buttons.forEach((button) => { button.addEventListener('click', () => { 
       this.setPayment(button.name);
       events.emit('setPayment:changed', {name: button.name} )})})

    }

    setPayment(name: string){
        this._buttons.forEach((button) => {this.toggleClass(button, 'button_alt-active', button.name === name)})
    }

    set address(value: string){
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }
}