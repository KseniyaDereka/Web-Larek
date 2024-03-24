import './scss/styles.scss';

import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { AppState, LotItem, CatalogChangeEvent } from './components/AppData';
import { Page } from './components/Page';
import { Card } from './components/Card';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { Popup } from './components/common/Popup';
import { Basket } from './components/common/Basket';
import { BasketItem } from './components/BasketItem';
import { IOrderForm, PaymentMethod } from './types';
import { Order } from './components/Order';
import { Contacts } from './components/Contacts';
import { Success } from './components/common/Success';
import { WebLarekAPI } from './components/WebLarekApi';

const events = new EventEmitter();
const api = new WebLarekAPI(CDN_URL, API_URL);
const appData = new AppState({}, events); // Модель данных приложения

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Popup(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);

// Дальше идет бизнес-логика
// Поймали событие, сделали что нужно

//Главная страница
// Выводим галерею
events.on<CatalogChangeEvent>('lots:show', () => {
	page.catalog = appData.catalog.map((item) => {
		//для каждого обьекта товара из appdata создаем карточку
		const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
		});
	});
});

// Получаем карточки с сервера
api
	.getLotList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});

// Открыть превью карточки
events.on('card:select', (item: LotItem) => {
	const showItem = (item: LotItem) => {
		const preview = new Card('card', cloneTemplate(cardPreviewTemplate), {
			onClick: () => {
				const check = appData.checkBasket(item);
				if (check) {
					//если в корзине лежит карточка
					events.emit('lot:deleted', item);
				} else {
					events.emit('lot:added', item);
				}
			},
		});
		modal.render({
			content: preview.render({
				title: item.title,
				image: item.image,
				description: item.description,
				category: item.category,
				price: item.price,
				Button: appData.checkBasket(item), //устанавливаем надпись на кнопке
			}),
		});
	};

	//Получаем карточку для превью
	api
		.getLotItem(item.id)
		.then((result) => {
			showItem(item);
		})
		.catch((err) => {
			console.error(err);
		});
});

//Добавить лот в корзину
events.on('lot:added', (item: LotItem) => {
	appData.addLot(item);
	modal.close();
});

//Корзина
//Удалить лот из корзины по нажатию на иконку мусорки в корзине или по нажатию на кнопку убрать в превью карточки
events.on('lot:deleted', (item: LotItem) => {
	appData.removeLot(item.id);
	modal.close();
});

//Открыть корзину
events.on('basket:open', () => {
	modal.render({
		content: createElement<HTMLElement>('div', {}, [basket.render()]),
	});
});

//Изменение корзины(удаление/добавление лотов, подсчет общей суммы, установка счетчика)
events.on('basketContent:changed', () => {
	basket.items = appData.setBasket().map((item, index) => {
		const basketCard = new BasketItem(
			'card',
			cloneTemplate(cardBasketTemplate),
			{
				onClick: () => {
					events.emit('lot:deleted', item);
				},
			}
		);
		return basketCard.render({
			title: item.title,
			price: item.price,
			index,
		});
	});
	basket.total = appData.getTotal();
	page.counter = appData.setBasket().length;
});

//Открыть окно с методом оплаты и адресом по нажатию на кнопку "Оформить"
events.on('order:open', () => {
	modal.render({
		content: order.render({
			payment: 'card',
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

// Изменилось состояние валидации формы оплаты и адреса
events.on('deliveryErrors:change', (errors: Partial<IOrderForm>) => {
	const { address, payment } = errors;
	order.valid = !address && !payment;
	order.errors = Object.values(errors)
		.filter((i) => !!i)
		.join('; ');
});

// Изменилось поле адрес
events.on('order.address:change', (data: { value: string }) => {
	appData.setAddressField(data.value);
});

//Выбрать метод оплаты
events.on('setPayment:changed', (event: { name: PaymentMethod }) => {
	appData.setPayField(event.name);
});

//Открыть форму контактов
events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

//Изменилось состояние валидации формы контактов
events.on('contactsErrors:change', (errors: Partial<IOrderForm>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values(errors)
		.filter((i) => !!i)
		.join('; ');
});

// Изменилось поле имейл или телефон
events.on(
	/^contacts\.(email|phone):change/,
	(data: {
		field: keyof Pick<IOrderForm, 'email' | 'phone'>;
		value: string;
	}) => {
		appData.setOrderFormField(data.field, data.value);
	}
);

//Оформить заказ
events.on('contacts:submit', () => {
	appData.setOrder();
	api
		.orderLots(appData.order)
		.then((result) => {
			const success = new Success(
				appData.getTotal(),
				cloneTemplate(successTemplate),
				{
					onClick: () => {
						modal.close();
						appData.clearBasket();//очищаем корзину и заказ
						appData.clearOrder();
					},
				}
			);

			modal.render({
				content: success.render({}),
			});
		})
		.catch((err) => {
			console.error(err);
		})

		.finally(() => {
			appData.clearOrder();
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
