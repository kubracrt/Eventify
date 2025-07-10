

# Eventify – Mobil Etkinlik Takip Uygulaması

Eventify, kullanıcıların çevresindeki etkinlikleri keşfedebileceği, yeni etkinlikler oluşturabileceği ve detaylarını görüntüleyebileceği bir mobil uygulamadır.
 Uygulama, **React Native (Expo)** ile geliştirilmiş olup, basit bir **Node.js + Express** API ile iletişim kurar.

---

## Kurulum Adımları

### 1. Backend (API Sunucusu)

```bash
cd backend
npm install
node server.js
````


### 2. Frontend (Mobil Uygulama)

```bash
cd frontend
npm install
npx expo start
```

---


## API Uç Noktaları

| Yöntem | URL                                 | Açıklama                                      |
|--------|--------------------------------------|-----------------------------------------------|
| POST   | `/register`                         | Yeni kullanıcı oluşturma                      |
| POST   | `/login`                            | Kullanıcı girişi (JWT token döner)            |
| GET    | `/events?page=1&limit=10`           | Sayfalı etkinlik listesi                      |
| GET    | `/events/:id`                       | Etkinlik detayını getirme                     |
| POST   | `/events`                           | Yeni etkinlik oluşturma                       |
| PUT    | `/events/:id`                       | Etkinlik güncelleme                           |
| DELETE | `/events/:id`                       | Etkinlik silme                                |
| GET    | `/events/user/:user_id`             | Kullanıcının oluşturduğu etkinlikleri getirme |


---

## Kullanılan Teknolojiler

### Frontend

* React Native + Expo
* React Navigation (Stack + Tab)
* Context API
* react-query
* React Hook Form
* Axios

### Backend

* Node.js
* Express.js
* JWT Authentication
* JSON tabanlı veri saklama

---

##  Temel Özellikler

* Kullanıcı girişi / kayıt
* Etkinlik listesi (pagination destekli)
*  Etkinlik oluşturma
*  Etkinlik detaylarını görüntüleme
*  Profil sayfası
*  API ile veri çekimi ve cache
*  Validasyon, loading ekranları
*  Modüler dosya yapısı

---

