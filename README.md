# www-upyachka/site-frontend

## Установка
1. Клонируем репозиторий в директорию домена фронтенда
	1. `cd /var/www/frontend && git clone https://github.com/www-upyachka/site-frontend`, вместо `/var/www/frontend` может быть другая директория, в зависимости от настроек Вашего вёб-сервера
	2. Или в случае отсутствия прямого доступа к серверу (если API будет на говнохостинге без root-доступа по SSH) [берем zip-архив](https://github.com/www-upyachka/site-frontend/archive/master.zip) с содержимым репозитория и распаковываем в корень директории домена. Например `/public_html/api` или `/api.your-site.net`
2. Переименовываем `static/js/config.example.js` в `static/js/config.js` и правим под себя
