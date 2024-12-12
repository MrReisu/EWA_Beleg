# EWA-Buchshop - SvelteKit

## Setup

### Installiere Abhängigkeiten

```bash
npm install
```

### Starte die Anwendung

```bash
npm run dev
```

### Strapi & Benötigte Umgebungsvariablen

Die Anwendung benötigt eine laufende Strapi-Instanz. Diese muss unter der URL `http://localhost:1337` erreichbar sein.

Dazu muss ein API-Key für Strapi generiert werden. Dieser muss in der Datei `.env` hinterlegt werden.

Zusätzlich muss ein Stripe-Account vorhanden sein. Die API-Keys müssen in der Datei `.env` hinterlegt werden.

Eine Vorlage ist in der Datei `.env.example` zu finden.

## Features (Benutzer)

- [x] Anzeige aller Bücher
- [x] Anzeige eines einzelnen Buches
- [x] Suche nach Büchern
- [x] Warenkorb
- [ ] Bestellung abschließen
- [ ] Stripe-Integration
- [ ] Bestellbestätigung


## Features (Admin)
- [ ] Anlegen eines neuen Buches
- [ ] Bearbeiten eines Buches
- [ ] Löschen eines Buches
- [ ] Bestellübersicht (Admin)
