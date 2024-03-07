export interface ILotItem {
    id: string;
    description?: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export type IBasketItem = Pick<ILotItem, 'id' | 'title' | 'price'> 
 
export interface Bucket {
   items:IBasketItem[];
   order: IOrder;
   itemIndex: number;
   total: number;
}

export interface IOrderForm {
    email: string;
    phone: string;
    address: string;
    payment: PaymentMethod;
    total: number;
}

export interface IOrder extends IOrderForm { 
    items: string[];
}

export type PaymentMethod = 'cash' | 'card'


export interface IOrderResult {
    id: string;
    total: number;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;


export interface IAppState {
    catalog: ILotItem[];
    basket: IBasketItem[];
    preview: string | null;
    order: IOrder | null;
}