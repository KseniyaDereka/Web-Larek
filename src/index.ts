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
    page.catalog = appData.catalog.map(item => {   //для каждого обьекта товара из appdata создаем карточку
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

// Открыть превью карточки
events.on('card:select', (item: LotItem) => {
    const showItem = (item: LotItem) => {
        const preview = new Card('card', cloneTemplate(cardPreviewTemplate), {
            onClick: () =>
            events.emit('basketAddContent:changed', item),
         });
        modal.render({
            content: preview.render({
                title: item.title,
                image: item.image,
                description: item.description,
                category: item.category,
                price: item.price
                
                })
            })
    }
  //получаем карточку для превью
api.getLotItem(item.id)
.then((result) => {
    console.log(item);
    showItem(item);
})
.catch(err => {
    console.error(err);
});

});







// Получаем карточки с сервера
api.getLotList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => {
        console.error(err);
    });

//открыть корзину

events.on('basket:open', () => {
    modal.render({
        content: createElement<HTMLElement>('div', {}, [
            basket.render()
        ])
    });
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
});