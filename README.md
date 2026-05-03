# CloudAbgabe1

# IaaS:

## VM erstellen und starten:

gcloud compute instances create my-vm
oder auf "Create instance" klicken

## Verbindung per SSH:

gcloud compute ssh my-vm
oder auf SSH klicken

## In VM:

### Node.js installieren:

sudo apt update
sudo apt install nodejs npm

### Anwendung starten:

node testIaaS.js

### Firewall-Regel erstellen:

gcloud compute firewall-rules create allow-3000 --allow tcp:3000

### Zugriff über externe IP:

http://34.40.10.218:3000

# PaaS:

## Projekt erstellen und auswählen:

gcloud projects create projectname
gcloud config set project projectname

## Services aktivieren:

gcloud services enable appengine.googleapis.com cloudbuild.googleapis.com

## App Engine initialisieren:

gcloud app create

## app.yaml erstellen

## Anwendung deployen:

gcloud app deploy

## Anwendung öffnen:

gcloud app browse

# FaaS:

cd Faas

Node.js Function:
gcloud functions deploy helloHttp --runtime nodejs22 --trigger-http --allow-unauthenticated

Python Function:
gcloud functions deploy hello_http --runtime python311 --trigger-http --allow-unauthenticated
