export interface ILotItem {
    id: string;
    description?: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
    Button: boolean;
}

export type IBasketItem = Pick<ILotItem, 'id' | 'title' | 'price'> & {
    index?: number;
}
 
export interface Bucket {
   items:IBasketItem[];
   order: IOrder;
   total: number;
}

export interface IOrderForm {
    email: string;
    phone: string;
    address: string;
    payment: PaymentMethod;
    
}

export interface IOrder extends IOrderForm { 
    items: string[];
    total: number;
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


export type ApiListResponse<Type> = {
    total: number,
    items: Type[]
};

