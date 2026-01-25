# Sicherheit & private Inhalte

Diese Website ist **privat**. Beim Pushen darf **kein sensibler Inhalt** auf GitHub landen.

## Nie ins Repository committen

- **Zugangsdaten:** Passwörter, API-Keys, Tokens, Zugangscodes
- **Umgebungsdateien mit Secrets:** `.env`, `.env.local`, `.env.production` usw. (außer ggf. `.env.example` ohne echte Werte)
- **Private Ordner:** z. B. `private/`, `_private/`, `content/private/`, `data/private/`
- **Persönliche Daten:** Adressen, Kontakte, Formular-Antworten, Exporte
- **Lokale Konfiguration mit Keys:** z. B. `config.local.js`, `*-secret*`, `*credentials*`
- **Backups/Exporte/Datenbanken:** `.sql`, `.sqlite`, `backups/`, `exports/` (können personenbezogene Daten enthalten)

## Vor jedem Push prüfen

1. **Check-Skript (empfohlen):** Im Projektordner ausführen:
   ```powershell
   .\scripts\check-before-push.ps1
   ```
   Das Skript meldet, wenn vorgemerkte Dateien zu sensiblen Mustern passen.
2. **Änderungen anzeigen:** `git status` und `git diff`
3. **Prüfen:** Stehen in den geänderten Dateien Passwörter, echte E-Mail-Adressen, API-Keys, private Pfade?
4. **Sicherheitsmuster:** Keine Dateien wie `.env`, `*secret*`, `*credentials*`, `private/` etc. stagen.

## .gitignore

Sensible Muster sind in `.gitignore` hinterlegt. Trotzdem: **keine** vertraulichen Inhalte in Dateinamen oder in Dateien packen, die versioniert werden. `.gitignore` schützt nur vor dem versehentlichen Hinzufügen bekannter Dateien.

## Bei versehentlich gepushten Secrets

1. Keys/Passwörter **sofort** beim jeweiligen Dienst neu setzen (rotieren).
2. Keine alten Secrets aus der Git-Historie wiederverwenden – sie gelten als kompromittiert.

---

*Bei Fragen oder Verdacht auf geleakte Daten: Zugangsdaten rotieren und ggf. Repository-Berechtigungen prüfen.*
