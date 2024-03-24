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


export type ApiListResponse<Type> = {
    total: number,
    items: Type[]
};


export const category: Record<string, string> =  {
    "софт-скил": "_soft",
    "другое": "_other",
    "дополнительное": "_additional",
    "кнопка": "_button",
    "хард-скил": "_hard"
}