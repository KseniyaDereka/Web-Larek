# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack
Паттерн программирования: MVP

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Описание данных
 
Интерфейс с данными для карточки с главной страницы.
interface ILotItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

Тип для товара в корзине.
type BusketItem = Pick<LotItem, 'id' | 'title' | 'price'> 

Интерфейс для данных отображенных в корзине, массив товаров и типы для данных заказа.
interface Bucket {
   items: BusketItem[];
   order: IOrder;
   itemIndex: number;
   total: number;
}

Интерфейсы для формы заказа.
interface IOrderForm {
    email: string;
    phone: string;
    adress: string;
    payment: PaymentMethod;
}

Интерфейс для заказа.
interface IOrder extends IOrderForm { 
    items: [];
}

Тип для выбора метода оплаты.
type PaymentMethod = 'cash' | 'card'

Интерфейс для попапа "Заказ оформлен".
interface IOrderResult {
    id: string;
    total: number;
}
 
Интерфейс для всех данных компонентов приложения.
export interface IAppState {
    catalog: LotItem[];
    basket: string[];
    preview: string | null;
    order: IOrder | null;
}


Интерфейс для ошибок формы.
type FormErrors = Partial<Record<keyof IOrder, string>>;

## Компоненты представления(Presenter)

#Класс Api — базовый класс 
Принимает в конструктор:
1. baseUrl: string – базовый адрес 
2. options: RequestInit = {} – свойства
Имеет методы:


#Класс WebLarekApi наследует класс Api и имплементирует интерфейс
interface ILarekAPI {
    getLotList: () => Promise<ILotItem[]> - получить каталог лотов.
    getLotItem: (id: string) => Promise<ILotItem> - получить лот.
    orderLots: (order: IOrder) => Promise<IOrderResult> - получить результат заказа.
}

Принимает в конструктор:
1.cdn: string — каширование ссылок на изображения.
2.baseUrl: string — базовый адрес.
3.options?: RequestInit — 

Имеет методы интерфейса ILarekAPI.

#Класс Event Emitter 

## Модели данных(Model)
![UML scheme](./UML_schemes/Model-scheme.png)

#Класс Model — базовый абстрактный класс типа дженерик — принимает в переменной T тип данных. 
Принимает в конструктор:
1. data: Partial<T> — опциональные свойства данных.
2. protected events: IEvents — защищенные события. 

Имеет метод:
emitChanges(event: string, payload?: object) — принимает как аргумент событие, и опциональный параметр данные.
Метод нужен чтобы сообщить что произошло какое-то событие и изменить данные.


#Класс LotItem — наследует класс Model.Нужен для создания обьктов лотов.
Принимает в конструктор:
1. data: Partial<ILotItem>
Собственных методов не имеет.

#Класс AppData наследует абстрактный класс Model и содержит методы для работы и изменения данных проекта.
Принимает в конструктор:
1. data: Partial<IAppState>

Имеет методы:
1. addLot(lot: IBasketItem):void - добавить лот в корзину.
2. removeLot(id: string): void - удалить лот из корзины.
3. clearOrder(): void - очистить данные из заказа.
4. clearBasket(): void - очистить корзину после заказа.
5. getTotal(): number - получить общую сумму заказа.
6. setCatalog(items: LotItem[]): void - получить данные всех товаров.
7. setBasket(): IBasketItem[] - получить список товаров в корзине.
8. checkBasket(item: IBasketItem): boolean - проверить есть ли лот в корзине(для того чтобы сменить надпись на кнопке)
9. setOrder(): void - получить данные для оформления заказа.
10. setOrderPayField(value: PaymentMethod):void - передать в поле оплаты заказов выбранный пользователем вариант.
11. setOrderFormField(field: keyof Pick<IOrder, 'address'  | 'email' | 'phone'  >, value: string ):void - передать в остальные поля форм заказов данные пользователя.
12. checkValidation(): void - проверить прошли ли данные пользователя валидацию.
13. validateDeliveryForm():boolean - валидация формы оплаты и доставки.
14. validateContactsForm():boolean - валидация формы контактов.


## Компоненты отображения(View)
![UML scheme](./UML_schemes/Model-scheme.png)

#Класс View 

#Класс Popup

#Класс Page

какие компонеты будут Popup, Card, Popup with preview, Basket, OrderFormDelivery, OrderFormContacts, OrderDone