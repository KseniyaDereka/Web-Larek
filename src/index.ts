import './scss/styles.scss';


import {API_URL, CDN_URL} from "./utils/constants";
import {EventEmitter} from "./components/base/events";
import {AppState, LotItem, CatalogChangeEvent} from "./components/AppData";
import {Page} from "./components/Page";
import {Card} from "./components/Card";
import {cloneTemplate, createElement, ensureElement} from "./utils/utils";
import {Popup} from "./components/common/Popup";
import {Basket} from "./components/common/Basket";
import {BasketItem} from "./components/BasketItem";
import {IOrderForm} from "./types";
import {Order} from "./components/Order";
import {Contacts} from "./components/Contacts";
import {Success} from "./components/common/Success";
import { WebLarekAPI } from './components/WebLarekApi';

const events = new EventEmitter();
const api = new WebLarekAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Popup(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);

// Дальше идет бизнес-логика
// Поймали событие, сделали что нужно

// Изменились элементы каталога
events.on<CatalogChangeEvent>('items:changed', () => {
    page.catalog = appData.catalog.map(item => {
        const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        });
        return card.render({
            title: item.title,
            image: item.image,
            price: item.price,
            category: item.category
        });
    });

    page.counter = appData.setBasket().length;
});





// Получаем карточки с сервера
api.getLotList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => {
        console.error(err);
    });