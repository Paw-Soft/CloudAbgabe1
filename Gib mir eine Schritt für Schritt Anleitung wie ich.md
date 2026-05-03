## Schritt 1: Google Cloud einrichten

Das ist die Grundlage für alles andere.[^1]

1. Google-Account erstellen und auf [console.cloud.google.com](https://console.cloud.google.com) einloggen
2. Ein neues **Google Cloud Projekt** anlegen (z. B. `my-first-project`)
3. **Abrechnung aktivieren** (Kreditkarte nötig, aber Free Tier reicht für die Aufgabe)
4. **Budgetwarnung einrichten** unter `Abrechnung → Budgets & Warnungen` — z. B. auf 20 € — damit keine unerwarteten Kosten entstehen[^1]
5. **gcloud CLI installieren**: [cloud.google.com/sdk/docs/install](https://cloud.google.com/sdk/docs/install)
6. Im Terminal ausführen: `gcloud init` und mit deinem Account verbinden
7. Ein **Dienstkonto (Service Account)** mit minimalen Rechten anlegen (IAM → Dienstkonten)

## Schritt 2: IaaS – Virtuelle Maschine (Compute Engine)

Hier machen wir alles selbst — wie ein echter Server-Admin.

1. In der Google Cloud Console: `Compute Engine → VM-Instanzen → Erstellen` oder `gcloud compute instances create my-vm `eingeben
2. Wähle eine kleine Instanz: `e2-micro` (kostenlos im Free Tier), Region `europe-west3` (Frankfurt)
3. Betriebssystem: Debian oder Ubuntu
4. **Firewall-Regel aktivieren**: HTTP-Traffic (Port 80) erlauben
5. Per SSH verbinden: `gcloud compute ssh INSTANZNAME` oder klicken
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
4. Wiederhole das Deployment einmal über die **Cloud Shell** (Browser-Terminal in Google Cloud) und einmal lokal

> 💡 **Lernziel:** Du merkst, dass du kein Betriebssystem mehr kennst — App Engine skaliert automatisch und du bezahlst nur was du nutzt.

***

## Schritt 4: FaaS – Google Cloud Functions

Jetzt schreibst du nur noch einzelne Funktionen, keinen ganzen Server.

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
FROM node:22
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "app.js"]
EXPOSE 8080
```

2. Lokal bauen \& testen: `docker build -t my-app . && docker run -p 8080:8080 my-app`
3. Image in Google Container Registry pushen: `gcloud builds submit --tag gcr.io/project-5275880f-46b8-4881-876/my-app`

**5b: Deployment auf Google Kubernetes Engine (GKE)**

1. Cluster erstellen: `gcloud container clusters create mein-cluster --zone europe-west3-a`
2. App deployen: `kubectl create deployment meine-app --image=gcr.io/project-5275880f-46b8-4881-876/my-app`
3. Service erstellen (extern erreichbar): `kubectl expose deployment meine-app --type=LoadBalancer --port=80 --target-port=8080`

**5c: Deployment auf Cloud Run** (einfacher als GKE)

1. `gcloud run deploy meine-app --image gcr.io/project-5275880f-46b8-4881-876/my-app --platform managed --region europe-west3 --allow-unauthenticated`

> 💡 **Lernziel:** Du verstehst den Unterschied zwischen **GKE** (volle Kontrolle über Cluster, komplex) und **Cloud Run** (serverless Container, einfacher) — Container selbst sind aber immer gleich portabel.

***

## Reflexion

## Technische Reflexion: Vergleich der Cloud-Modelle

Im Rahmen dieser Teilabgabe wurde dieselbe Web-Anwendung in vier verschiedenen Cloud-Modellen umgesetzt. Die folgende Reflexion vergleicht die eingesetzten Varianten hinsichtlich zentraler technischer und betrieblicher Kriterien.

***

### Implementierungsaufwand

* **IaaS** erforderte den höchsten Aufwand: Betriebssystem, Laufzeitumgebung, Firewall und Deployment mussten manuell konfiguriert werden. 
* **PaaS** reduzierte diesen Aufwand erheblich — ein einziger CLI-Befehl (`gcloud app deploy`) genügte. 
* **Container** (GKE/Cloud Run) erfordern zunächst das Erstellen eines Dockerfiles und das Bauen eines Images, sind danach aber gut reproduzierbar. 
* **FaaS** hatte den geringsten Aufwand: Eine einzelne Funktion reichte aus, ohne jegliche Infrastrukturkonfiguration.



***

| Kriterium | IaaS (Compute Engine) | PaaS (App Engine) | Container (GKE / Cloud Run) | FaaS (Cloud Functions) |
| :-- | :-- | :-- | :-- | :-- |
| **Implementierungsaufwand** | 🔴 Sehr hoch | 🟡 Gering | 🟡 Mittel | 🟢 Minimal |
| **Kosten bei Inaktivität** | 🔴 VM läuft immer | 🟡 Skaliert runter | 🔴 GKE: läuft / 🟢 Cloud Run: auf 0 | 🟢 Keine Kosten |
| **Kostenkontrolle** | Vorhersehbar | Vorhersehbar | GKE: teurer / Cloud Run: günstig | Pay-per-Use, sehr günstig |
| **Sicherheit** | 🔴 Volle Eigenverantwortung | 🟢 Managed by Google | 🟡 Geteilt (Image + Cluster) | 🟢 Stark isoliert, keine persistente Infrastruktur |
| **Skalierbarkeit** | 🟡 Manuell oder mit Autoscaler | 🟢 Automatisch | 🟢 GKE: sehr flexibel / Cloud Run: automatisch | 🟢 Automatisch, auf 0 skalierbar |
| **Typisches Einsatzszenario** | Legacy-Software, spezielle OS-Anforderung, GPU-Workloads | Einfache Web-Apps, APIs, schnelles Deployment | Microservices (GKE), containerisierte APIs (Cloud Run) | Webhooks, event-basierte Aufgaben, Bild-Thumbnails |


***

### Fazit

Die Wahl des Cloud-Modells hängt stark vom Anwendungsfall ab:
* **IaaS** bietet maximale Kontrolle, erfordert aber den größten Betriebsaufwand — sinnvoll bei speziellen Systemanforderungen. 
* **PaaS** ist ideal für schnelles Deployment ohne Infrastrukturwissen. 
* **Container** sind die flexibelste Option: Cloud Run eignet sich für einfache, zustandslose Services mit unregelmäßigem Traffic, GKE für komplexe Microservice-Architekturen mit dauerhafter Last. 
* **FaaS** ist die abstrakteste und kosteneffizienteste Variante für kleine, event-getriebene Aufgaben — allerdings ungeeignet für langlebige Prozesse oder komplexe Zustandsverwaltung.

***

## 💡 Die Kern-Erkenntnis der Aufgabe

| Was ich selbst verwalte | Modell |
| :-- | :-- |
| Alles (OS, Software, Netzwerk) | IaaS (Compute Engine) |
| Nur Code + Config | PaaS (App Engine) |
| Container + Orchestrierung | Container (GKE / Cloud Run) |
| Nur einzelne Funktionen | FaaS (Cloud Functions) |

# **Der Betriebsaufwand ändert sich mit dem Abstraktionsgrad.**
