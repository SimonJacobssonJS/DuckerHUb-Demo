# Uppgift – CI/CD med Node.js, Docker och GitHub Actions

Det här repot innehåller en enkel **Node.js/Express-applikation** som containeriseras med **Docker**
och deployas automatiskt till **Docker Hub** via **GitHub Actions**.

Syfte: visa ett enkelt men komplett flöde:

1. Bygg & test av appen
2. Bygg av Docker-image
3. Push av Docker-image till Docker Hub

Docker Hub-image: `simonjacobssonchas/uppgift-demo:latest`

---

## Projektstruktur

```text
Uppgift DockerHub/
├── index.js
├── package.json
├── Dockerfile
├── README.md
└── .github/
    └── workflows/
        ├── build.yml
        └── docker-build-push.yml
```

---

## Applikationen (Node.js + Express)

`index.js` innehåller en mycket enkel HTTP-server:

```js
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.json({ message: 'CI/CD Demo Running!' });
});

app.listen(port, () => {
  console.log(`Server kör på http://localhost:${port}`);
});
```

När servern körs svarar den på:

- `GET /` med ett JSON-svar: `{ "message": "CI/CD Demo Running!" }`

---

## Köra lokalt utan Docker

Krav:

- Node.js
- npm

Installera beroenden:

```bash
npm install
```

Starta applikationen:

```bash
npm start
```

Öppna sedan i webbläsaren:

```text
http://localhost:3000
```

Du ska se JSON i stil med "message": "CI/CD Demo Running!" .

---

## Bygga och köra med Docker (lokalt)

Bygg image:

```bash
docker build -t uppgift-demo .
```

Kör containern:

```bash
docker run -p 3000:3000 uppgift-demo
```

Öppna:

```text
http://localhost:3000
```

---

## GitHub Actions – Workflows

Det finns två workflows i `.github/workflows/`:

### 1. `build.yml` – Build och enkel test

- Triggas på:
  - varje `push` till `main`
  - varje `pull_request`
- Steg:
  1. Checkar ut koden
  2. Installerar Node 18
  3. Kör `npm install`
  4. Kör `npm test` (en väldigt enkel "test" som bara loggar att testet körts)

Detta visar att projektet går att bygga innan vi skapar en Docker-image.

---

### 2. `docker-build-push.yml` – Bygg & push till Docker Hub

- Triggas på:
  - varje `push` till `main`
- Steg:
  1. Checkar ut koden
  2. Loggar in mot Docker Hub med GitHub Secrets
  3. Bygger Docker-image med:
     ```bash
     docker build -t simonjacobssonchas/uppgift-demo:latest .
     ```
  4. Pushar imagen till Docker Hub:
     ```bash
     docker push simonjacobssonchas/uppgift-demo:latest
     ```

---

## GitHub Secrets (för Docker Hub)

För att workflowet ska kunna logga in mot Docker Hub måste två secrets sättas
i GitHub-repot:

1. `DOCKERHUB_USERNAME` – ditt Docker Hub-användarnamn  
   → `simonjacobssonchas`
2. `DOCKERHUB_TOKEN` – ett Access Token från Docker Hub
   - Skapas via Docker Hub: **Account Settings → Security → New Access Token**
   - Klistra in värdet som secret i GitHub:  
     `Settings → Secrets and variables → Actions → New repository secret`

Workflowet använder dessa i steget:

```yaml
- name: Logga in på Docker Hub
  uses: docker/login-action@v3
  with:
    username: ${{ secrets.DOCKERHUB_USERNAME }}
    password: ${{ secrets.DOCKERHUB_TOKEN }}
```

---
