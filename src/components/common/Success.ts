import { View } from "../base/View";
import {ensureElement} from "../../utils/utils";

interface ISuccess {
    total: number;
}

interface ISuccessActions {
    onClick: () => void;
}

export class Success extends View<ISuccess> {
    protected _close: HTMLElement;
    protected _total: HTMLElement;

    constructor(container: HTMLElement, actions: ISuccessActions, value: number) {
        super(container);
        this._total = ensureElement<HTMLElement>('order-success__description', this.container);
        this._close = ensureElement<HTMLElement>('.state__action', this.container);

        if (actions?.onClick) {
            this._close.addEventListener('click', actions.onClick);
            this._total.textContent = `Списано ${value} синапсов`
        }
    }
    
}