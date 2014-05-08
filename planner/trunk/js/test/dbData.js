define(["html"], function($H){with($H){
	
	return {
		queue:[
			"gss_1",
			"grossblock_3",
			"portal_2",
			"aga_1"
		],
		persons:{
			KKA:{name:"Калинников К.М."},
			SIA:{name:"Семенков И.А."},
			KSV:{name:"Краснопевцев С.В."},
			LAV:{name:"Ларионов Андрей Владимирович"},
			BA:{name:"Бажова Анна"},
			AVA:{name:"Алексеев В."},
			VVV:{name:"Владыкин В.В."},
			TEB:{name:"Терехин Е."}
		},
		projects:{
			gss:{
				name:"ГСС", 
				color:"#088",
				tasks:[
					{id:"gss_1", name:"Залить новости", initiator:"BA", completed:"2013-04-12", jobs:[{date:"2013-04-12", hours:2.5}]},
					{id:"gss_2", name:"Не открываются страницы новостей", initiator:"BA", completed:"2013-04-15", jobs:[{date:"2013-04-15", hours:3}]},
					{id:"gss_3", name:"Сделать новую версию сайта с дизайном как у Гроссблок", initiator:"VVV", jobs:[
						{date:"2013-06-24", hours:6},
						{date:"2013-06-25", hours:8},
						{date:"2013-06-26", hours:8},
						{date:"2013-06-27", hours:8},
						{date:"2013-07-22", hours:5, notes:"Сделал цветные фото в промо-блоке"}
					]}
				]
			},
			port2:{
				name:"Порт 2",
				color:"#08a",
				tasks:[
					{id:"port2_1", name:"Извлечь верстку", description:"Извлечь верстку сайта из резервной копии", initiator:"KKA", jobs:[
						{date:"2013-07-23", hours:6},
						{date:"2013-07-24", hours:6}
					]}
				]
			},
			grossblock:{
				name:"Гроссблок",
				color:"#008",
				description:"Сайт Рыбинского завода",
				tasks:[
					{id:"grossblock_0", name:"Совещания", jobs:[
						{date:"2013-04-18", hours:3, notes:"На Тверской ждали Седова."}
					]},
					{id:"grossblock_2", name:"Карта офисов", tasks:[
						{id:"grossblock_1", name:"Улучшить отображение карты", initiator:"SIA",
							tasks:[
								{id:"grossblock_1_1", name:"Под картой добавить фильтр по городу", initiator:"KSV", description:[
									p("Под картой добавить фильтр по городу. При выборе города в списке остаются точки продаж в этом городе и карта масштабируется до города и ближайших окрестностей.")], jobs:[{date:"2013-05-06", hours:3}]},
								{id:"grossblock_1_2", name:"Структурировать офисы по городам", initiator:"SIA", completed:"2013-05-14", jobs:[{date:"2013-05-14", hours:2}]},
								{id:"grossblock_1_3", name:"Масштабирование карты", description:"Масштабировать карту по выбранному в списке региону", initiator:"SIA", completed:"2013-05-15", jobs:[{date:"2013-05-15", hours:3.5}]}
							],
							jobs:[
								{date:"2013-04-11", hours:3},
								{date:"2013-04-16", hours:3, notes:"Нашел место, где глюк, но из-за кэширования компонента ничего не смог изменить."},
								{date:"2013-04-17", hours:1},
								{date:"2013-04-24", hours:4},
								{date:"2013-04-30", hours:4, notes:"Сделал новую карту с пиктограммами и таблицей"}
						]
						},
						{id:"grossblock_3", name:"Опубликовать страницу с картой", initiator:"BA", completed:"2013-04-11", jobs:[{date:"2013-04-11", hours:0.5}]},
						{id:"grossblock_4", name:"Заливка данных об офисах", initiator:"BA", description:"Залить данные с привязкой к картам",
							completed:"2013-04-16",
							jobs:[
								{date:"2013-04-11", hours:4},
								{date:"2013-04-12", hours:3},
								{date:"2013-04-16", hours:3},
								{date:"2013-05-17", hours:1},
								{date:"2013-05-20", hours:2}
							]
						},
						{id:"grossblock_5", name:"Открыть Благовой доступ к редактированию таблицы офисов", initiator:"BA"}
					]},
					{id:"grossblock_6", name:"Поставить боковые баннеры", initiator:"BA",
						description:[
							p("См. H:\\Мои документы\\Projects\\grossblock\\banners"),
							p(a({href:"http://grossblock.ru/"}, "http://grossblock.ru/")),
							p("На главной баннер справа \"Постоянно в наличии на складе\", на внутренних - слева с погрузчиком. Оба баннера выводить со сменой и там, и там."),
							p("Ссылка с баннеров - на указанные e-mailы, всплывающая подсказка \"Написать письмо\""),
						],
						completed:"2013-04-17",
						jobs:[
							{date:"2013-04-17", hours:3.5}
						],
						tasks:[
							{id:"grossblock_6_1", name:"Статистика по баннерам", initiator:"BA", jobs:[
								{date:"2013-05-22", hours:3, notes:"Разобрался с модулем Реклама (advertising), но применить его на существующем сайте нельзя, т.к. он там не установлен."}
							]}
						]
					},
					{id:"grossblock_7", name:"Промо-блок", initiator:"SIA", completed:"2013-04-22", description:[
							p("Сделать анимированный промо-блок как на сайте ГСС."),
							p("Предусмотреть отслеживание изменения размера экрана - чтобы размер промо-блока всегда соответствовал ширине экрана.")
						], jobs:[
							{date:"2013-04-17", hours:2},
							{date:"2013-04-18", hours:2.5},
							{date:"2013-04-22", hours:2.5}
					], tasks:[
						{id:"grossblock_7_1", name:"Отключить подгонку шрифтов в слоганах", completed:"2013-04-30", jobs:[{date:"2013-04-30", hours:1}]}
					]},
					{id:"grossblock_8", name:"Таблица-калькулятор", initiator:"KKA", description:"См. материалы: H:\\\\Мои документы\\Projects\\grossblock\\Таблицы",
						jobs:[
							{date:"2013-04-19", hours:3, notes:"Сделал демо, передал Ивану, чтобы верстку подрихтовал."},
							{date:"2013-04-23", hours:4.5, notes:"Пытался сделать схлопывающиеся столбцы. Сделал компонент grains.vAccordion. Недоделал."},
							{date:"2013-04-30", hours:2, notes:"Исправил ошибку отображения в IE, подправил форматирование."},
							{date:"2013-05-06", hours:1, notes:"Исправил ошибку отображения границ таблицы в IE."}
						],
						tasks:[
							{id:"grossblock_8_1", name:"Форма отправки заявки", description:"Формировать из таблицы-калькулятора заявку, и отправлять ее на заданный e-mail.", initiator:"SIA", completed:"2013-05-15", jobs:[
								{date:"2013-05-14", hours:3.5},
								{date:"2013-05-15", hours:4}
							]},
							{id:"grossblock_8_2", name:"Уменьшить высоту ячеек в таблице-калькуляторе", initiator:"LAV", completed:"2013-05-17", jobs:[{date:"2013-05-17", hours:2}]},
							{id:"grossblock_8_3", name:"Общая сумма и количество ассортимента при заказе должны отображатся или сверху таблицы, или в другом заметном для пользователя месте.", initiator:"SIA", completed:"2013-05-21", jobs:[{date:"2013-05-21", hours:2}]},
							{id:"grossblock_8_4", name:"Переключение между разделами таблицы", initiator:"SIA", completed:"2013-05-23", jobs:[{date:"2013-05-23", hours:3.5}]}
						]
					},
					{id:"grossblock_9", name:"Развернуть сайт на локальном Денвере", jobs:[
						{date:"2013-04-22", hours:3}
					]},
					{id:"grossblock_10", name:"Заменить в меню \"Каталог\" на \"Продукция\".", initiator:"KKA", completed:"2013-04-23",
						description:[
							p("Задание из протокола от 2013-04-18"),
							p("Выполнить на существующем сайте ", a({href:"http://grossblock.ru/"}, "http://grossblock.ru/"))
						],
						jobs:[{date:"2013-04-23", hours:.5}]
					},
					{id:"grossblock_11", name:"Добавить аккордеон в раздел \"Как купить/Краснодарский край\"", completed:"2013-04-23", initiator:"KKA",
						description:[
							p("Выполнить на существующем сайте ", a({href:"http://grossblock.ru/"}, "http://grossblock.ru/"))
						],
						jobs:[{date:"2013-04-23", hours:2, notes:"Иван отменил."}]
					},
					{id:"grossblock_12", name:"Выложить по адресу grossblock.micc.ru готовую версию сайта", completed:"2013-04-29", initiator:"KKA", jobs:[
						{date:"2013-04-29", hours:5, notes:"Восстановил работоспособность стайта (каталог bitrix был переименован в bitriks. Разместил подписи в промо-блоке, вставил калькулятор заказа продукции."}
					]},
					{id:"grossblock_13", name:"Добавить новость про расширение ассортимента", completed:"2013-05-08", initiator:"LAV", jobs:[{date:"2013-05-08", hours:1.5}]},
					{id:"grossblock_14", name:"Сделать ссылки из таблицы продукции на страницы с ее описанием", initiator:"SIA", completed:"2013-05-16", jobs:[{date:"2013-05-16", hours:2}]},
					{id:"grossblock_15", name:"Перенести галерею", description:"Взять на существующем сайте grossblock.ru галерею фото и видео, и перенести ее на новый сайт.", initiator:"SIA", completed:"2013-05-29", jobs:[{date:"2013-05-23", hours:4},{date:"2013-05-27", hours:4},{date:"2013-05-29", hours:2}]}
				]
			},
			besttools:{
				name:"Бесттулз",
				tasks:[
					{id:"besttools_1", name:"Странички для выгрузки данных через Ajax", initiator:"SIA", jobs:[
						{date:"2013-04-25", hours:7}
					]},
					{id:"besttools_2", name:"Вывести в карточку товара свойства Артикул и Производитель.", completed:"2013-04-26", initiator:"SIA", jobs:[{date:"2013-04-26", hours:1.5}]},
					{id:"besttools_3", name:"В разделе Чип-тюнинг настроить селектор.", initiator:"SIA", completed:"2013-04-26", jobs:[{date:"2013-04-26", hours:1.5}]},
					{id:"besttools_4", name:"Кнопка \"Купить\" в анонсах селектора.", initiator:"SIA", completed:"2013-04-26", jobs:[{date:"2013-04-26", hours:1.5}]},
					{id:"besttools_5", name:"Вывести цены в анонсы селектора.", initiator:"SIA"},
					{id:"besttools_6", name:"Привести в порядок поля в карточке элемента чип-тюнинга", initiator:"SIA", completed:"2013-04-26", jobs:[{date:"2013-04-26", hours:2.5}]},
					{id:"besttools_7", name:"Второй уровень в тюнинге - тип двигателя брать из свойства инфо-блока", initiator:"SIA", completed:"2013-05-06", jobs:[{date:"2013-05-06", hours:2}]},
					{id:"besttools_8", name:"Третий и четвертый уровни в магазине комплектующих - тип двигателя и тип запчасти, брать из свойств инфо-блока", initiator:"SIA", completed:"2013-05-06", jobs:[{date:"2013-05-06", hours:1}]},
					{id:"besttools_9", name:"Вывести артикул в карточки товаров селектора", initiator:"SIA", completed:"2013-05-06", jobs:[{date:"2013-05-06", hours:1}]},
					{id:"besttools_10", name:"Прямая ссылка в чип-тюнинге", initiator:"SIA",
						description:[
							p("Открываем чип-тюнинг, кликаем на пиктуху Alfa Romeo, видим какую-то странную верстку."),
							p("Вместо этого должна быть прямая ссылка с пиктухи на детальную карту")
						],
						jobs:[
							{date:"2013-05-07", hours:2.5}
						]},
					{id:"besttools_11", name:"Поля Производитель и Артикул в карточках магазина", description:"В магазине клик на производителя (список, выводимый магазином по умолчанию) -> в карточках тоже показать производителя и артикул", initiator:"SIA", completed:"2013-05-07", jobs:[{date:"2013-05-07", hours:2.5}]},
					{id:"besttools_12", name:"Поиск по артикулу", description:"Переходим в магазин комплектующих, и в верхнем правом углу видим поле поиска. Пока работает только по названию товара. Сделать, чтобы работало также и по артикулу.", initiator:"SIA", completed:"2013-05-13", jobs:[{date:"2013-05-13", hours:4.5},{date:"2013-05-14", hours:2}]},
					{id:"besttools_13", name:"Отображать блок спецпредложений по условию поиска", description:"Переходим в магазин, вверху списка - блок спецпредложений. Показывать его только в том случае, если справа не выбран фильтр предложений.", initiator:"SIA", completed:"2013-05-13", jobs:[{date:"2013-05-13", hours:.6}]},
					{id:"besttools_14", name:"Развернуть приложение на хостинге заказчика", initiator:"VVV", jobs:[
						{date:"2013-06-14", hours:6},
						{date:"2013-06-17", hours:8},
						{date:"2013-06-20", hours:3}
					]},
					{id:"besttools_15", name:"Исправить ошибку поиска", initiator:"VVV", description:"Не правильно формируется URL в результатах поиска", completed:"2013-06-19", jobs:[
						{date:"2013-06-18", hours:8},
						{date:"2013-06-19", hours:6}
					]}
				]
			},
			portal:{
				name:"Портал",
				description:"Корпоративный портал на MS SharePoint",
				tasks:[
					{id:"portal_0", name:"Совещания", jobs:[
						{date:"2013-04-24", hours:"3", notes:"На Стромынке"}
					]},
					{id:"portal_1", name:"Learn SharePoint", jobs:[
						{date:"2013-06-03", hours:"3"}
					]},
					{id:"portal_2", name:"Изучить документацию", description:"Изучить представленную документацию, дать по ней заключение", initiator:"TEB", jobs:[
						{date:"2013-08-27", hours:"4"}
					]}
				]
			},
			system:{
				name:"Система",
				description:"Настройка рабочего места",
				color:"#a00",
				tasks:[
					{id:"system_1", name:"Настройка доступа по FTP.", description:"Слава настроил удаленно доступ через Forefront.TMG через прокси.", completed:"2013-04-15", jobs:[{date:"2013-04-15", hours:2}]},
					{id:"system_2", name:"Denver installation", jobs:[{date:"2013-04-19", hours:3, notes:"Долго со Славой мучились - был конфликт у Денвера и VisualSVN Server'а по 443 порту. Уговорили SVN на 8443-м поработать."}]},
					{id:"system_3", name:"Настройка АРМ на Стромынке", jobs:[{date:"2013-06-13", hours:2}]},
					{id:"system_4", name:"Резервное копирование проектов", jobs:[{date:"2013-06-13", hours:1}]}
				]
			},
			dataBases:{
				name:"Базы данных",
				description:"Работы по нашим базам данных",
				tasks:[
					{id:"dataBases_1", name:"Составить список используемых БД", initiator:"AVA", completed:"2013-05-27", jobs:[{date:"2013-05-27", hours:1.5}]}
				]
			},
			department:{
				name:"Наш отдел",
				description:"Организационные мероприятия в отделе",
				tasks:[
					{id:"department_1", name:"Написать должностную инструкцию на меня", initiator:"SIA", completed:"2013-05-28", jobs:[{date:"2013-05-28", hours:1}]}
				]
			},
			aga:{
				name:"Aga",
				description:"Разработка архитектуры Ajax-приложения для хранения, отображения и редактирования JSON-документов.",
				tasks:[
					{id:"aga_1", name:"Базовая реализация", jobs:[{date:"2013-04-16", hours:2}]},
					{id:"aga_2", name:"Модуль архивации", jobs:[{date:"2013-04-17", hours:1.5}]}
				]
			}
		}
	};
}});