<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Gib mir eine Schritt für Schritt Anleitung wie ich die Aufgaben löse und erkläre kurz, den Sinn hinter der Aufgabe bzw. bringe mir bei, was ich dabei lernen soll.

Super, ich habe deine Aufgabenstellung vollständig gelesen. Hier ist die vollständige Schritt-für-Schritt-Anleitung:[^1]

***

## 🎯 Was du dabei lernst

Das Ziel ist es, **dieselbe einfache Web-Anwendung** in vier verschiedenen Cloud-Modellen zu deployen. Du lernst dadurch nicht nur die Theorie, sondern spürst praktisch den Unterschied zwischen „ich verwalte alles selbst" (IaaS) und „ich schreibe nur noch Code" (FaaS). Am Ende kannst du begründen, **wann welches Modell sinnvoll ist** — das ist die eigentliche Kernkompetenz.[^1]

***

## Schritt 1: Google Cloud einrichten

Das ist die Grundlage für alles andere.[^1]

1. Google-Account erstellen und auf [console.cloud.google.com](https://console.cloud.google.com) einloggen
2. Ein neues **Google Cloud Projekt** anlegen (z. B. `webtechnologien-computing`)
3. **Abrechnung aktivieren** (Kreditkarte nötig, aber Free Tier reicht für die Aufgabe)
4. **Budgetwarnung einrichten** unter `Abrechnung → Budgets & Warnungen` — z. B. auf 20 € — damit keine unerwarteten Kosten entstehen[^1]
5. **gcloud CLI installieren**: [cloud.google.com/sdk/docs/install](https://cloud.google.com/sdk/docs/install)
6. Im Terminal ausführen: `gcloud init` und mit deinem Account verbinden
7. Ein **Dienstkonto (Service Account)** mit minimalen Rechten anlegen (IAM → Dienstkonten)[^1]

> 💡 **Lernziel:** Du verstehst, wie Cloud-Projekte strukturiert sind, was IAM bedeutet und warum minimale Zugriffsrechte (Principle of Least Privilege) wichtig sind.

***

## Schritt 2: IaaS – Virtuelle Maschine (Compute Engine)

Hier machst du alles selbst — wie ein echter Server-Admin.[^1]

1. In der Google Cloud Console: `Compute Engine → VM-Instanzen → Erstellen`
2. Wähle eine kleine Instanz: `e2-micro` (kostenlos im Free Tier), Region `europe-west3` (Frankfurt)
3. Betriebssystem: Debian oder Ubuntu
4. **Firewall-Regel aktivieren**: HTTP-Traffic (Port 80) erlauben
5. Per SSH verbinden: `gcloud compute ssh INSTANZNAME`
6. Node.js installieren: `sudo apt install nodejs npm`
7. Deine einfache Web-App hochladen und starten: `node app.js`
8. Die externe IP-Adresse der VM im Browser aufrufen — fertig!

> 💡 **Lernziel:** Du siehst, wie viel manueller Aufwand nötig ist: Betriebssystem, Software, Netzwerk — alles deine Verantwortung.

***

## Schritt 3: PaaS – Google App Engine

Hier gibst du Server-Verwaltung ab und deployst nur noch Code.[^1]

1. Eine `app.yaml` Datei im Projektordner erstellen:
```yaml
runtime: nodejs20
```

2. Deployment per CLI: `gcloud app deploy`
3. App aufrufen: `gcloud app browse`
4. Wiederhole das Deployment einmal über die **Cloud Shell** (Browser-Terminal in Google Cloud) und einmal lokal[^1]

> 💡 **Lernziel:** Du merkst, dass du kein Betriebssystem mehr kennst — App Engine skaliert automatisch und du bezahlst nur was du nutzt.

***

## Schritt 4: FaaS – Google Cloud Functions

Jetzt schreibst du nur noch einzelne Funktionen, keinen ganzen Server.[^1]

1. Erstelle eine einfache HTTP-Funktion in **Node.js**:
```javascript
exports.helloWorld = (req, res) => {
  res.send('Hallo von Cloud Functions!');
};
```

2. Deployen: `gcloud functions deploy helloWorld --runtime nodejs20 --trigger-http --allow-unauthenticated`
3. Die generierte URL im Browser aufrufen
4. **Bonus:** Dieselbe Funktion in einer zweiten Sprache schreiben, z. B. Python:[^1]
```python
def hello_world(request):
    return 'Hallo von Python!'
```

5. Deployen mit `--runtime python312`

> 💡 **Lernziel:** Du verstehst Serverless — keine Infrastruktur, kein dauerhafter Server, Bezahlung nur per Ausführung (Millisekunden-genau).

***

## Schritt 5: Container – Docker, GKE \& Cloud Run

Hier verpackst du deine App portabel und deployest sie auf zwei Arten.[^1]

**5a: Docker-Image bauen**

1. `Dockerfile` erstellen:
```dockerfile
FROM node:20
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "app.js"]
EXPOSE 8080
```

2. Lokal bauen \& testen: `docker build -t meine-app . && docker run -p 8080:8080 meine-app`
3. Image in Google Container Registry pushen: `gcloud builds submit --tag gcr.io/PROJEKT-ID/meine-app`

**5b: Deployment auf Google Kubernetes Engine (GKE)**

1. Cluster erstellen: `gcloud container clusters create mein-cluster --zone europe-west3-a`
2. App deployen: `kubectl create deployment meine-app --image=gcr.io/PROJEKT-ID/meine-app`
3. Service erstellen (extern erreichbar): `kubectl expose deployment meine-app --type=LoadBalancer --port=80 --target-port=8080`[^1]

**5c: Deployment auf Cloud Run** (einfacher als GKE)

1. `gcloud run deploy meine-app --image gcr.io/PROJEKT-ID/meine-app --platform managed --region europe-west3 --allow-unauthenticated`[^1]

> 💡 **Lernziel:** Du verstehst den Unterschied zwischen **GKE** (volle Kontrolle über Cluster, komplex) und **Cloud Run** (serverless Container, einfacher) — Container selbst sind aber immer gleich portabel.

***

## Schritt 6: Dokumentation \& Reflexion (für die Abgabe)

Das ist ein bewertetes Pflichtbestandteil.[^1]

1. **README.md** schreiben mit: Architektur, welche GCP-Dienste, Deploymentschritte, lokale Ausführung
2. **Reflexion** verfassen mit Vergleich der 4 Modelle nach:
    - Implementierungsaufwand
    - Kosten
    - Sicherheit
    - Skalierbarkeit
    - Typische Einsatzszenarien[^1]

***

## 💡 Die Kern-Erkenntnis der Aufgabe

| Was ich selbst verwalte | Modell |
| :-- | :-- |
| Alles (OS, Software, Netzwerk) | IaaS (Compute Engine) |
| Nur Code + Config | PaaS (App Engine) |
| Container + Orchestrierung | Container (GKE / Cloud Run) |
| Nur einzelne Funktionen | FaaS (Cloud Functions) |

Die Aufgabe ist bewusst so gestaltet, dass die **fachliche App einfach sein darf** — ein simpler "Hello World"-Webserver reicht. Es geht nicht um die App, sondern darum zu verstehen, **wie sich der Betriebsaufwand mit dem Abstraktionsgrad verändert**.[^1]

<div align="center">⁂</div>

[^1]: 1_Abgabe_Computing.pdf

