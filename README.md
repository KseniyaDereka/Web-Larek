# Проектная работа "Веб-ларек"

_Проект магазина где за внутреннюю валюту можно преобрести веб-айтемы._

__Стек:__ HTML, SCSS, TS, Webpack
__Паттерн программирования:__ упрощённая версия архитектурного паттерна MVP.

__Структура проекта:__

- `src/` — исходные файлы проекта
- `src/components/` — папка с JS компонентами
- `src/components/base/` — папка с базовым кодом

__Важные файлы:__

- `src/pages/index.html` — HTML-файл главной страницы
- `src/types/index.ts` — файл с типами
- `src/index.ts` — точка входа приложения
- `src/sсss/styles.scss` — корневой файл стилей
- `src/utils/constants.ts` — файл с константами
- `src/utils/utils.ts` — файл с утилитами

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

Интерфейс с данными для карточки.

```
interface ILotItem {
    id: string;
    description?: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
    Button: boolean;
}
```

Тип для товара в корзине.

```
type BusketItem = Pick<LotItem, 'id' | 'title' | 'price'>& {index?: number;}
```

Интерфейс для данных отображенных в корзине, массив товаров и типы для данных заказа.

```
interface Bucket {
   items: BusketItem[];
   order: IOrder;
   total: number;
}
```

Интерфейсы для формы заказа.

```
interface IOrderForm {
    email: string;
    phone: string;
    adress: string;
    payment: PaymentMethod;
    
}
```

Интерфейс для заказа.

```
interface IOrder extends IOrderForm {
    items: string[];
    total: number;
}
```

Тип для выбора метода оплаты.

```
type PaymentMethod = 'cash' | 'card'
```

Интерфейс для попапа "Заказ оформлен".

```
interface IOrderResult {
    id: string;
    total: number;
}
```

Интерфейс для всех данных компонентов приложения.

```
interface IAppState {
    catalog: LotItem[];
    basket: string[];
    preview: string | null;
    order: IOrder | null;
}
```

Тип для ошибок формы.

```
type FormErrors = Partial<Record<keyof IOrder, string>>;
```

Тип для получения списка товаров по запросу API

```
type ApiListResponse<Type> = {
    total: number,
    items: Type[]
};
```
## Базовый код

### Класс Api.

Базовый класс для работы с серверными данными.
Принимает в конструктор: `(baseUrl: string, options: RequestInit = {})`

1. `baseUrl: string` – базовый адрес
2. `options: RequestInit = {}` – свойства

 Имеет методы:
1. `get(uri: string)` - получить данные с сервера.
2. `post(uri: string, data: object, method: ApiPostMethods = 'POST')` - отправить данные на сервер.

### Класс EventEmitter.

Реализует паттерн «Наблюдатель» и позволяет подписываться на события и уведомлять подписчиков о наступлении события.

Имеет методы:

1. `On` - установить обработчик на событие.
2. `Off` - снять обработчик с события.
3. `Emit` — для подписки на событие, отписки от события и уведомления подписчиков о наступлении события соответственно.
4. `onAll` - установить обработчики на все.
5. `offAll` - убрать обработчики со всех.
6. `trigger` - генерирует заданное событие с заданными аргументами. Это позволяет передавать его в качестве обработчика события в другие классы. Эти классы будут генерировать события, не будучи при этом напрямую зависимыми от класса EventEmitter.

### Класс `Model<T>`

Базовый абстрактный класс типа дженерик — принимает в переменной T тип данных.
Принимает в конструктор:`(data: Partial<T>, protected events: IEvents)`

1. `data: Partial<T>` — опциональные свойства данных.
2. `protected events: IEvents` — защищенные события.

Имеет метод:
`emitChanges(event: string, payload?: object)` — принимает как аргумент событие, и опциональный параметр данные.
Метод нужен чтобы сообщить что произошло какое-то событие и изменить данные.

### Класс View`<T>`
Базовый абстрактный класс типа дженерик — принимает в переменной T тип данных.
Принимает в конструктор: `(protected readonly container: HTMLElement)` — контейнер куда будут рендериться данные.

Реализует методы отвечающие за отображение
данных на странице. Такие как:

1. `toggleClass(element: HTMLElement, className: string, force?: boolean)` - преключаем класс в зависимости от булевого значения.
2. `protected setText(element: HTMLElement, value: unknown)` - установить содержимое элементу.
3. `setDisabled(element: HTMLElement, state: boolean)` - заблокировать элемент в зависимости от булевого значения.
4. `protected setHidden(element: HTMLElement)` - защищенный метод скрывающий элемент.
5. `protected setVisible(element: HTMLElement)` - защищенный метод показывающий элемент.
6. `protected setImage` - установить изображение и описание к нему.
7. `render(data?: Partial<T>): HTMLElement` - вывод контейнера на страницу.

## Компоненты представления(Presenter)
**_Слой архитектуры необходимый для связывания слоя Model и слоя View._**

В качестве презентера выступает корневой файл index.ts, описывающий взаимодействие отображения и данных между собой по наступлению события, благодаря организации подписки на события в брокере событий (экземпляр класса EventEmitter).

__Список событий.__
- `'basketContent:changed'` - изменение содержимого корзины
- `'basket:open'` - открытие корзины
- `'lots:show'` - отображение каталога
-  `'order:ready'` - поля заказа заполнены и прошли валидацию
-  `'order:open'` - открытие формы оплаты и адреса
-  `'order:submit'` - открытие формы контактов
-  `'contacts:submit'` - отправить заказ
-  `'modal:open'` - открытие попапа
-  `'modal:close'` - закрытие попапа
-  `'preview:set'` - присвоить id нажатой карточки id из каталога
-  `'preview:open'` - открытие превью
-  `'lot:added'` - добавление лота в корзину
-  `'lot:deleted'` - удаление лота из корзины
-  `'deliveryErrors:change'`- изменение состояния валидации формы оплаты и адреса
-  `'setPayment:changed'` - сменить метод оплаты
-  `'contactsErrors:change'` - изменение состояния валидации формы контактов



## Модели данных(Model)
**_Слой архитектуры необходимый для хранения и изменения данных._**
### Класс AppData

Наследует абстрактный класс Model и содержит методы для работы и изменения данных проекта.
Принимает в конструктор: (`data: Partial<IAppState>`) - опциональные свойства  типа IAppState.


Имеет методы:

1. `addLot(lot: IBasketItem):void` - добавить лот в корзину.
2. `removeLot(id: string): void` - удалить лот из корзины.
3. `clearOrder(): void` - очистить данные из заказа.
4. `clearBasket(): void` - очистить корзину после заказа.
5. `getTotal(): number` - получить общую сумму заказа.
6. `setCatalog(items: LotItem[]): void` - получить данные всех товаров.
7. `setBasket(): IBasketItem[]` - получить список товаров в корзине.
8. `checkBasket(item: IBasketItem): boolean` - проверить есть ли лот в корзине(для того чтобы сменить надпись на кнопке)
9. `setOrder(): void` - получить данные для оформления заказа.
10. `setPayField(value: PaymentMethod):void` - передать в поле оплаты заказов выбранный пользователем вариант.
11. `setAddressField(value: string): void` - передать в поле адрес.
12. `setOrderFormField(field: keyof Pick<IOrder, 'email' | 'phone' >, value: string ):void` - передать в остальные поля форм заказов данные пользователя.
13. `checkDeliveryValidation(): void` - проверить прошли ли данные адреса и оплаты валидацию.
14. `validateDeliveryForm():boolean` - валидация формы оплаты и доставки.
15. `validateContactsForm():boolean` - валидация формы контактов.

### Класс LotItem
Наследует класс Model. Нужен для создания объктов лотов.
Принимает в конструктор: `(data: Partial<ILotItem>)`- опциональные свойства  типа ILotItem.


Собственных методов не имеет.

 ### Класс WebLarekApi.

   Наследует класс Api и имплементирует интерфейс IWebLarekAPI.

```

interface IWebLarekAPI {
getLotList: () => Promise<ILotItem[]> - получить каталог лотов.
getLotItem: (id: string) => Promise<ILotItem> - получить лот.
orderLots: (order: IOrder) => Promise<IOrderResult> - получить результат заказа.
}

```

Принимает в конструктор: `(cdn: string, baseUrl: string, options?: RequestInit)`

1.`cdn: string` — каширование ссылок на изображения.
2.`baseUrl: string` — базовый адрес.
3.`options?: RequestInit` — опциональные свойства.

Имеет методы интерфейса ILarekAPI.

## Компоненты отображения(View)
**_Слой архитектуры необходимый для отображения данных на странице._**
### Класс Popup
Наследует класс View. Отвечает за отрисовку модального окна.
Принимает в конструктор: `(container: HTMLElement, protected events: IEvents)`

1. `container: HTMLElement` - шаблон темплейта.
2. `events: IEvents` - событие Event Emitter.

Имеет методы:

1. `close()` - закрыть
2. `open()` - открыть
3. `render(data: IModalData)` - наполнить контентом модальное окно.

### Класс Page
Наследует класс View. Отвечает за отрисовку главной страницы.
Принимает в конструктор: `(container: HTMLElement, protected events: IEvents)`

1. `container: HTMLElement` - шаблон темплейта.
2. `events: IEvents` - событие Event Emitter

Имеет методы:

1. `set catalog(items: HTMLElement[])` - отрисовка каталога.
2. `set counter(value: number)` - установка счетчика на корзине.
3. `set locked(value: boolean)` - блокировка прокручивания страницы.

### Класс Card
Наследует класс View. Отвечает за отрисовку карточки товара. Имеет методы реализующие отрисовку деталей карточки.
Принимает в конструктор: `(protected blockName: string, container: HTMLElement, actions?: ICardActions)`

1. `protected blockName: string` - название блока разметки.
2. `container: HTMLElement` - шаблон темплейта.
3. `actions?: ICardActions` - какие события произойдут по клику.

Имеет методы:

1. `set title(value: string)` - установка заголовка.
2. `set image(value: string)` - установка ссылки на изображение.
3. `set description(value: string)` - установка описания. Нужно при отрисовке превью.
4. `set category(value: string)` - установка категории.
5. `set price(value: number)` - установка цены.
6. `set Button(state: boolean)` - метод для реализации смены надписей на кнопке. В зависимости от наличия товара в корзине будет принимать булевое значение, и устанавливать нужную строку на кнопке.

### Класс Basket
Наследует класс View. Отвечает за отрисовку корзины.
Принимает в конструктор: `(container: HTMLElement, protected events: EventEmitter)`

1. `container: HTMLElement` - шаблон темплейта.
2. `events: IEvents` - событие Event Emitter

Имеет методы:

1. `set items(items: HTMLElement[])` - отрисовка списка товаров, или строки если корзина пуста.
2. `set total(total: number)` - установка общей цены товаров корзины.

### Класс BasketItem
Наследует класс View. Отвечает за отрисовку карточки товара в корзине.
Принимает в конструктор: `(protected blockName: string, container: HTMLElement, actions?: ICardActions)`

1. `protected blockName: string` - название блока разметки.
2. `container: HTMLElement` - шаблон темплейта.
3. `actions?: ICardActions` - какие события произойдут по клику.

Имеет методы:

1. `set title(value: string)` - установка заголовка.
2. `set price(value: number)` - установка цены товара.
3. `set index(value: number)` - установка интекса товара в списке.

### Класс Form
Наследует класс View. Отвечает за блокировку кнопок, показ ошибок и отрисовку формы.
Принимает в конструктор: `(protected container: HTMLFormElement, protected events: IEvents)`

1. `container: HTMLElement` - шаблон темплейта.
2. `events: IEvents` - событие Event Emitter

Имеет методы:

1. `onInputChange(field: keyof T, value: string)` - для отслеживания изменений в поле инпута.
2. `set valid(value: boolean)` - блокировка кнопки сабмита формы.
3. `set errors(value: string)` - установка ошибок.
4. `render(state: Partial`<T>` & IFormState)` - рендер ошибок.

### Класс Order
Наследует класс Form. Отвечает за отрисовку формы заказа с полями адрес и методом оплаты.
Принимает в конструктор: `(container: HTMLFormElement, events: IEvents)`

1. `container: HTMLElement` - шаблон темплейта.
2. `events: IEvents` - событие Event Emitter

Имеет методы:

1. `setPayment(name: string)` - переключение кнопок с методом оплаты.
2. `set address(value: string)` - установка адреса заказчика

### Класс Contacts
Наследует класс Form. Отвечает за отрисовку формы контактов.
Принимает в конструктор: `(container: HTMLFormElement, events: IEvents)`

1. `container: HTMLElement` - шаблон темплейта.
2. `events: IEvents` - событие Event Emitter

Имеет методы:

1. `set phone(value: string)` - установка телефона заказчика в поле заказа.
2. `set email(value: string)` - установка имейла заказчика в поле заказа.

### Класс Success
Наследует класс View. Отвечает за отрисовку окна успешного заказа.
Принимает в конструктор: `(value: number, container: HTMLElement, actions: ISuccessActions)`

1. `value: number` - значение для установки общей цены заказа.
2. `container: HTMLElement` - шаблон темплейта.
3. `actions: ISuccessActions` - какие события произойдут по клику.

Методов не имеет.

```

```
