# PlantPals
 
**PlantPals** je spletna aplikacija za zanesljivo, sledljivo in dokumentirano začasno varstvo sobnih rastlin. Ko gre lastnik na dopust ali službeno pot, ga aplikacija poveže z *varuhom*, ki je na voljo v ustreznem obdobju in na ustrezni lokaciji (po mestu/regiji) — namesto neformalnih in nezanesljivih dogovorov s sosedi.
 
Vsaka rastlina ima lastna navodila za oskrbo, med varstvom varuh vodi *dnevnik oskrbe*, ob koncu pa lastnik *potrdi vrnitev*, da je zaključek jasen in dokumentiran za obe strani.
 
---

## Uporabljene tehnologije
 
| Del | Tehnologija |
|---|---|
| **Frontend** | React + Vite (SPA), Axios, React Router |
| **Backend** | NestJS (TypeScript, Node.js) — plastni monolit (moduli: auth, users, plants, assignments) |
| **Podatkovna baza** | MongoDB + Mongoose |
| **Avtentikacija** | JWT prek Passport.js (`@nestjs/passport`, `passport-jwt`), bcrypt za gesla, role-based dostop prek Guards |
| **Validacija** | `class-validator` |
| **Lokalni razvoj** | Docker Compose (API + MongoDB), `.env` |
 
**Arhitektura:** ločen SPA + REST API. Komunikacija SPA ↔ API poteka prek REST/JSON čez HTTPS, vsaka zahteva nosi JWT v `Authorization` glavi; API ↔ MongoDB prek Mongoose.
 
---

## Lokalni zagon

### Predpogoji
- [Node.js](https://nodejs.org/) 20+ (z npm)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (mora biti zagnan)
- Git

### 1. Kloniranje
```bash
git clone https://github.com/ikki27/PlantPals.git
cd PlantPals
```

### 2. Okoljske spremenljivke
```bash
cp backend/.env.example backend/.env     # nato v backend/.env vpiši svoj JWT_SECRET
cp frontend/.env.example frontend/.env
```

### 3. Backend + baza (Docker)
```bash
docker compose up --build
```
- API teče na http://localhost:3000/api
- Preverjanje delovanja: http://localhost:3000/api/health → `{"status":"ok","database":"connected", ...}`
- MongoDB teče na `localhost:27017`

Ustavitev: `Ctrl + C` oziroma `docker compose down`.

### 4. Frontend (v novem terminalu)
```bash
cd frontend
npm install
npm run dev
```
Aplikacija teče na http://localhost:5173. Na začetni strani piše **»API deluje, baza: connected«**, če je backend pravilno zagnan.

### Alternativa: backend brez Dockerja (za razvoj)
Če želiš backend poganjati lokalno s samodejnim ponovnim nalaganjem ob spremembah kode:
```bash
docker compose up -d mongo   # v Dockerju zaženi samo bazo
cd backend
npm install
npm run start:dev
```

---
 
## Dokumentacija
 
Celotna projektna dokumentacija je v mapi [`docs/`](docs/):
 
- [01 — Zasnova rešitve](docs/01-zasnova-resitve.md) — namen, ciljni uporabniki, opis delovanja
- [02 — Funkcionalnosti in obseg](docs/02-funkcionalnosti-in-obseg.md) — vloge, funkcionalnosti, MVP, out of scope
- [03 — Podatkovni model](docs/03-podatkovni-model.md) — entitete, polja, povezave
- [04 — Arhitektura in tehnološki sklad](docs/04-arhitektura-in-tehnoloski-sklad.md) — arhitektura, komunikacija, odločitve
- [05 — Uporabniške zgodbe](docs/05-uporabniske-zgodbe.md) — user stories in acceptance criteria
- [06 — Wireframes](docs/06-wireframes.md) — skice vmesnika.
 
