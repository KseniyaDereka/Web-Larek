# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

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

