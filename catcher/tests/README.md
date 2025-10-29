# Тесты для Catcher API

Простые тесты для проверки API эндпоинтов приложения Catcher, написанные с использованием FastAPI TestClient.

## Установка зависимостей

```bash
uv pip install pytest pytest-asyncio httpx
```

Или через pip:

```bash
pip install pytest pytest-asyncio httpx
```

## Запуск тестов

### Запустить все тесты

```bash
pytest tests/
```

### Запустить с подробным выводом

```bash
pytest tests/ -v
```

### Запустить конкретный тест

```bash
pytest tests/test_api.py::test_create_user -v
```

### Запустить с показом print statements

```bash
pytest tests/ -s
```

## Структура тестов

```
tests/
├── conftest.py          # Фикстуры pytest (TestClient, sample data)
├── test_api.py          # Все тесты API эндпоинтов
└── README.md            # Этот файл
```

## Что тестируется

### Основное приложение
- ✅ Корневой эндпоинт `/`
- ✅ Документация `/docs`
- ✅ OpenAPI схема `/openapi.json`
- ✅ CORS middleware

### User Routes (`/users/`)
- ✅ Создание пользователя (`POST /users/`)
- ✅ Получение пользователя по ID (`GET /users/{user_id}`)
- ✅ Получение пользователя по username (`GET /users/username/{username}`)
- ✅ Список пользователей с пагинацией (`GET /users/`)
- ✅ Обновление пользователя (`PUT /users/{user_id}`)
- ✅ Удаление пользователя (`DELETE /users/{user_id}`)
- ✅ Валидация дубликатов username
- ✅ Валидация обязательных полей
- ✅ Обработка несуществующих пользователей (404)

### Track Routes (`/tracks/`)
- ✅ Валидация обязательного поля URL
- ✅ Обработка невалидных URL

### Интеграционные тесты
- ✅ Полный lifecycle пользователя (CRUD)
- ✅ Создание множества пользователей без конфликтов

## Примеры использования

### Тест создания пользователя

```python
def test_create_user(client: TestClient, sample_user_data):
    response = client.post("/users/", json=sample_user_data)
    assert response.status_code == 200
    assert "id" in response.json()
```

### Тест получения пользователя

```python
def test_get_user_by_id(client: TestClient, sample_user_data):
    # Создаем пользователя
    create_response = client.post("/users/", json=sample_user_data)
    user_id = create_response.json()["id"]
    
    # Получаем пользователя
    response = client.get(f"/users/{user_id}")
    assert response.status_code == 200
```

## Фикстуры

### `client`
TestClient для отправки HTTP запросов к приложению FastAPI.

```python
def test_example(client: TestClient):
    response = client.get("/")
    assert response.status_code == 200
```

### `sample_user_data`
Тестовые данные пользователя:

```python
{
    "username": "testuser",
    "password": "testpassword123",
    "avatar_url": "https://example.com/avatar.jpg"
}
```

### `sample_track_url`
Пример URL трека для тестирования.

## Особенности

- **Тесты используют реальную базу данных** из `database.py` (SQLite)
- База очищается при старте приложения через `lifespan` в `main.py`
- Каждый запуск тестов работает с чистой базой
- TestClient автоматически управляет жизненным циклом приложения

## Что НЕ тестируется

- ❌ Реальное извлечение треков через yt-dlp (требует моков)
- ❌ Глубокое тестирование CRUD слоя напрямую
- ❌ Тестирование отношений likes между users и tracks

Эти тесты можно добавить позже при необходимости.

## Troubleshooting

### Ошибка "command not found: pytest"
Убедитесь, что зависимости установлены и виртуальное окружение активировано.

### Тесты падают с ошибками базы данных
Проверьте, что `database.py` корректно настроен и база данных доступна.

### Import errors
Убедитесь, что вы запускаете pytest из корневой директории проекта (`catcher/`).

## Запуск из корневой директории

```bash
cd /path/to/catcher
pytest tests/ -v
```

## Результат успешного запуска

```
======================== test session starts =========================
collected 25 items

tests/test_api.py::test_root_endpoint PASSED                   [  4%]
tests/test_api.py::test_create_user PASSED                     [  8%]
tests/test_api.py::test_get_user_by_id PASSED                  [ 12%]
...
======================== 25 passed in 0.5s ==========================
```
