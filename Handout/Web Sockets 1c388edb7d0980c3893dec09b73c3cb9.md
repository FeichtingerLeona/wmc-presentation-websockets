# Web Sockets

Course: WMC (https://www.notion.so/WMC-13888edb7d0981eb8c2aebbae7dd9e80?pvs=21)

## Was ist ein Web Socket

WebSockets sind ein Kommunikationsprotokoll, das eine dauerhafte, bidirektionale Verbindung zwischen Client und Server ermöglicht. Die Verbindung bleibt bestehen und wird nicht wie bei http für jeden request neu aufgebaut und dann wider geschlossen

## Vorteile

- Netzwerknutzung ist effizienter weil die Verbindung für mehrere Requests benutzt werden kann und man dann auch nicht dauernd einen neuen overhead benötigt der Bandbreit und Verarbeitungszeit einnimmt
- Die dauerhafte Verbindung ermöglicht Echtzeit Kommunikation, weil Web Sockets dauerhaft erlauben (solange die Verbindung läuft) das der Server oder Client Daten schicken. Das ist gut für Chat oder Spiele.

## Nachteile

### **Nicht ideal für einfache „Request/Response“-Use Cases**

- Wenn du nur ab und zu Daten vom Server brauchst, ist WebSocket **überdimensioniert**.
- Klassische REST-APIs oder HTTP/2 Push können oft einfacher und ressourcenschonender sein.

### **Sicherheitsrisiken**

- Ein dauerhaft offener Kanal kann zum Ziel für:
    - **DDoS-Angriffe** (viele offene Verbindungen fluten den Server),
    - **Resource Leaks** (wenn Verbindungen nicht sauber geschlossen werden),
    - **Zombie-Verbindungen** (abgebrochene Clients, die am Server hängen bleiben).
- Außerdem braucht man sehr sorgfältiges **Zugriffs- und Berechtigungsmanagement**.

## Wie funktionieren Web Sockets

1. Der Client schickt eine Anfrage an den Server 
2. Ein sogenannter handshake wird gemacht. Dieser handshake legt den Header fest für die gesamte Verbindung hier ein Beispiel wie so ein Header aussieht von HTTP und Web Sockets 
3. Es werden Bidirectional Daten hin und her geschickt also der Client kann während der Verbindung dauerhaft Anfragen stellen und der Server kann dauerhaft Antworten schicken 

HTTP Header ACHTUNG HTTP/1.1

```tsx
GET /data HTTP/1.1 // data endpoint von server den wir anfragen 
Host: example.com //an wenn soll die anfrage gehen 
User-Agent: Mozilla/5.0//Browser 
Accept: application/json// bevorzugtes antwortormat vom server 
Connection: keep-alive
```

Dieser Header wir bei jeder HTTP anfrage gebraucht dazu werden noch kleine Daten Mengen zusätzlich gebraucht meistens bekommt man ein einfaches OK zurück 

```java
GET /index.html HTTP/1.0//fordert ressource, gewünschter pfad/endpoint 
Host: www.example.com //für welche domain ist die seite bestimmt 
User-Agent: Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)//Wer stellt die anfrage 
Accept: text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8 // Welcher content ty
```

---

---

### **`User-Agent: Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)`**

- Identifiziert den **Client** (Browser, Bot, App), der die Anfrage stellt.
- Hier meldet sich der Client als:
    - **Mozilla/4.0** → alte Standardkennung
    - **MSIE 6.0** → Internet Explorer 6.0
    - **Windows NT 5.1** → Windows XP

 Wird oft genutzt, um Webseiten für verschiedene Browser anzupassen oder Statistiken zu erheben.

---

### **`Accept: text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8`**

- Sagt dem Server, **welche Content-Typen** (MIME-Typen) der Client akzeptiert.
- Hier:
    - **text/html** → klassische HTML-Seiten
    - **application/xhtml+xml** → XHTML-Seiten
    - **application/xml** → XML-Daten (mit Priorität `q=0.9`)
    - **/*** → alle anderen Inhalte (mit Priorität `q=0.8`)

Die `q`-Werte (zwischen 0 und 1) zeigen an, **wie stark bevorzugt** ein Typ is

Web Socket Header 

```tsx
GET /chat HTTP/1.1// Das ist unsere Get Anfrage 
Host: example.com //Ziel Server 
Upgrade: websocket//Das fordert den Server auf das es die HTTP Anfrage zu einen Websocket umwandelt 
Connection: Upgrade//Signalisiert erneut das es auf Web Socket umgestellt werden soll
Sec-WebSocket-Key: x3JJHMbDL1EzLkh9YZrdMw==//Dieser Code stellt sicher das die Anfrage nicht einfach von irgendeinen HTTP Request kommt weil das immer ein zufällig generirter Web Socket key vom Client ist 
Sec-WebSocket-Version: 13//Protokoll Version
```

Es muss umgewandelt werden weil Web Sockets eine Erweiterung eines HTTP Requests sind 

Ab den Punkt Upgrade wird also unser Handshake gemacht der festlegt das es ein Web Socket Protokoll ist und ab dann wird die Verbindung auch gehalten

| Feature | HTTP/1.1 + Keep-Alive | WebSocket |
| --- | --- | --- |
| Verbindung | Mehrere HTTP-Anfragen über gleiche TCP-Verbindung, aber immer **Anfrage → Antwort** | Eine dauerhafte TCP-Verbindung, **ständig offen** |
| Nachrichtenfluss | Nur auf Anfragen, Server darf nicht von selbst „pushen“ | Beide Seiten dürfen jederzeit Frames senden |
| Protokollsprache | HTTP-Header, Statuscodes, Body | WebSocket-Frames, kein HTTP mehr |
| Lebenszeichen | TCP selbst oder evtl. eigene App-Logik | Eingebaute Ping/Pong-Frames, um Verbindung aktiv zu halten |

| Aktion | Beschreibung |
| --- | --- |
| **Wer sendet Ping?** | Entweder Client oder Server darf einen Ping-Frame schicken. |
| **Was passiert dann?** | Die Gegenstelle **muss automatisch** mit einem Pong-Frame antworten (kein App-Code nötig). |
| **Was steckt drin?** | Optional: Ping-Frame kann Nutzdaten enthalten (z. B. ein Identifikator), die exakt im Pong zurückgegeben werden. |
| **Timeout?** | Wenn eine Seite z. B. 30 Sekunden lang keinen Pong bekommt, kann sie die Verbindung schließen. |
|  |  |

![Screenshot 2025-05-04 at 4.25.24 PM.png](Web%20Sockets%201c388edb7d0980c3893dec09b73c3cb9/Screenshot_2025-05-04_at_4.25.24_PM.png)

 
**Serverprüfung**

Das bedeutet:

- Der Client muss **ständig** nachfragen, ob es was Neues gibt → das nennt man „Polling“.
- Das ist ineffizient, weil 90 % der Anfragen oft mit *„Nein, nichts Neues“* beantwortet werden.

---

### ⚡ **Mit WebSocket kann der Server pushen**

Bei WebSockets darf der Server **jederzeit** von sich aus eine Nachricht an den Client schicken, z. B.:

- *„Hey, hier ist eine neue Chat-Nachricht!“*
- *„Das Spiel hat sich gerade verändert.“*
- *„Ein neuer Börsenkurs ist da.“*

Der Client muss **nicht** vorher fragen, sondern bekommt alles in Echtzeit zugeschickt.

- Der Server prüft, ob er WebSockets unterstützt und ob der Pfad (z. B. `/scoreboard`) passt.
- Wenn ja, antwortet er mit:
    
    ```
    
    HTTP/1.1 101 Switching Protocols
    Upgrade: websocket
    Connection: Upgrade
    Sec-WebSocket-Accept: <hashed-key>
    
    ```
    
- **Code 101** heißt: Ich schalte jetzt auf WebSocket um.

 **Verbindung erfolgreich**

- Nach der 101-Antwort wird die HTTP-Verbindung „gekappt“, und stattdessen läuft nun ein **dauerhafter WebSocket-Datenstrom** über dieselbe TCP-Verbindung.
- Jetzt wird das `onopen`Event ausgelöst.

### **Wann wird die Verbindung beim Handshake gebrochen?**

Der Handshake bricht ab, wenn:

- Der Server keine WebSockets akzeptiert (z. B. weil der Pfad falsch ist).
- Der Server eine andere Antwort als **101** sendet (z. B. 400, 404, 500).
- Ein Load Balancer, Proxy oder Firewall die `Upgrade`Headers blockiert.
- Bei `wss://`: Das TLS-Zertifikat ungültig ist oder der Handshake auf der SSL-Ebene scheitert.
- Netzwerkfehler oder Timeout auftreten (z. B. Server ist nicht erreichbar).

In diesen Fällen:

- Kein `onopen`.
- Stattdessen wird **`onerror`** aufgerufen.
- Danach wird automatisch die Verbindung geschlossen, und `onclose` läuft.

---

### Wie kann ich sowas aber erstellen?

Client Seite 

```tsx
<!DOCTYPE html>
<script>
// Verbindung zum Server aufbauen 
ws = new WebSocket("ws://127.0.0.1/scoreboard") // Local server
// ws = new WebSocket("wss://game.example.com/scoreboard") // Remote server

ws.onopen = () => {
    console.log("Connection opened")
    ws.send("Hi server, please send me the score of yesterday's game")
}

ws.onmessage = (event) => {
    console.log("Data received", event.data)
    ws.close() // We got the score so we don't need the connection anymore
}

ws.onclose = (event) => {
    console.log("Connection closed", event.code, event.reason, event.wasClean)
}

ws.onerror = () => {
    console.log("Connection closed due to error")
}
</script>
```

- Bei `ws://` → unverschlüsselt (Port 80).
- Bei `wss://` → TLS/SSL-verschlüsselt (Port 443).

## Was ist ein Web Socket

WebSockets sind ein Kommunikationsprotokoll, das eine dauerhafte, bidirektionale Verbindung zwischen Client und Server ermöglicht. Die Verbindung bleibt bestehen und wird nicht wie bei http für jeden request neu aufgebaut und dann wider geschlossen

## Vorteile

- Netzwerknutzung ist effizienter weil die Verbindung für mehrere Requests benutzt werden kann und man dann auch nicht dauernd einen neuen overhead benötigt der Bandbreit und Verarbeitungszeit einnimmt
- Die dauerhafte Verbindung ermöglicht Echtzeit Kommunikation, weil Web Sockets dauerhaft erlauben (solange die Verbindung läuft) das der Server oder Client Daten schicken. Das ist gut für Chat oder Spiele.

## Nachteile

### **Nicht ideal für einfache „Request/Response“-Use Cases**

- Wenn du nur ab und zu Daten vom Server brauchst, ist WebSocket **überdimensioniert**.
- Klassische REST-APIs oder HTTP/2 Push können oft einfacher und ressourcenschonender sein.

### **Sicherheitsrisiken**

- Ein dauerhaft offener Kanal kann zum Ziel für:
    - **DDoS-Angriffe** (viele offene Verbindungen fluten den Server),
    - **Resource Leaks** (wenn Verbindungen nicht sauber geschlossen werden),
    - **Zombie-Verbindungen** (abgebrochene Clients, die am Server hängen bleiben).
- Außerdem braucht man sehr sorgfältiges **Zugriffs- und Berechtigungsmanagement**.

## Wie funktionieren Web Sockets

1. Der Client schickt eine Anfrage an den Server 
2. Ein sogenannter handshake wird gemacht. Dieser handshake legt den Header fest für die gesamte Verbindung hier ein Beispiel wie so ein Header aussieht von HTTP und Web Sockets 
3. Es werden Bidirectional Daten hin und her geschickt also der Client kann während der Verbindung dauerhaft Anfragen stellen und der Server kann dauerhaft Antworten schicken 

HTTP Header ACHTUNG HTTP/1.1

```tsx
GET /data HTTP/1.1 // data endpoint von server den wir anfragen 
Host: example.com //an wenn soll die anfrage gehen 
User-Agent: Mozilla/5.0//Browser 
Accept: application/json// bevorzugtes antwortormat vom server 
Connection: keep-alive
```

Dieser Header wir bei jeder HTTP anfrage gebraucht dazu werden noch kleine Daten Mengen zusätzlich gebraucht meistens bekommt man ein einfaches OK zurück 

```java
GET /index.html HTTP/1.0//fordert ressource, gewünschter pfad/endpoint 
Host: www.example.com //für welche domain ist die seite bestimmt 
User-Agent: Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)//Wer stellt die anfrage 
Accept: text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8 // Welcher content ty
```

---

---

### **`User-Agent: Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)`**

- Identifiziert den **Client** (Browser, Bot, App), der die Anfrage stellt.
- Hier meldet sich der Client als:
    - **Mozilla/4.0** → alte Standardkennung
    - **MSIE 6.0** → Internet Explorer 6.0
    - **Windows NT 5.1** → Windows XP

 Wird oft genutzt, um Webseiten für verschiedene Browser anzupassen oder Statistiken zu erheben.

---

### **`Accept: text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8`**

- Sagt dem Server, **welche Content-Typen** (MIME-Typen) der Client akzeptiert.
- Hier:
    - **text/html** → klassische HTML-Seiten
    - **application/xhtml+xml** → XHTML-Seiten
    - **application/xml** → XML-Daten (mit Priorität `q=0.9`)
    - **/*** → alle anderen Inhalte (mit Priorität `q=0.8`)

Die `q`-Werte (zwischen 0 und 1) zeigen an, **wie stark bevorzugt** ein Typ is

Web Socket Header 

```tsx
GET /chat HTTP/1.1// Das ist unsere Get Anfrage 
Host: example.com //Ziel Server 
Upgrade: websocket//Das fordert den Server auf das es die HTTP Anfrage zu einen Websocket umwandelt 
Connection: Upgrade//Signalisiert erneut das es auf Web Socket umgestellt werden soll
Sec-WebSocket-Key: x3JJHMbDL1EzLkh9YZrdMw==//Dieser Code stellt sicher das die Anfrage nicht einfach von irgendeinen HTTP Request kommt weil das immer ein zufällig generirter Web Socket key vom Client ist 
Sec-WebSocket-Version: 13//Protokoll Version
```

Es muss umgewandelt werden weil Web Sockets eine Erweiterung eines HTTP Requests sind 

Ab den Punkt Upgrade wird also unser Handshake gemacht der festlegt das es ein Web Socket Protokoll ist und ab dann wird die Verbindung auch gehalten

| Feature | HTTP/1.1 + Keep-Alive | WebSocket |
| --- | --- | --- |
| Verbindung | Mehrere HTTP-Anfragen über gleiche TCP-Verbindung, aber immer **Anfrage → Antwort** | Eine dauerhafte TCP-Verbindung, **ständig offen** |
| Nachrichtenfluss | Nur auf Anfragen, Server darf nicht von selbst „pushen“ | Beide Seiten dürfen jederzeit Frames senden |
| Protokollsprache | HTTP-Header, Statuscodes, Body | WebSocket-Frames, kein HTTP mehr |
| Lebenszeichen | TCP selbst oder evtl. eigene App-Logik | Eingebaute Ping/Pong-Frames, um Verbindung aktiv zu halten |

| Aktion | Beschreibung |
| --- | --- |
| **Wer sendet Ping?** | Entweder Client oder Server darf einen Ping-Frame schicken. |
| **Was passiert dann?** | Die Gegenstelle **muss automatisch** mit einem Pong-Frame antworten (kein App-Code nötig). |
| **Was steckt drin?** | Optional: Ping-Frame kann Nutzdaten enthalten (z. B. ein Identifikator), die exakt im Pong zurückgegeben werden. |
| **Timeout?** | Wenn eine Seite z. B. 30 Sekunden lang keinen Pong bekommt, kann sie die Verbindung schließen. |
|  |  |

![Screenshot 2025-05-04 at 4.25.24 PM.png](Web%20Sockets%201c388edb7d0980c3893dec09b73c3cb9/Screenshot_2025-05-04_at_4.25.24_PM.png)

 
**Serverprüfung**

Das bedeutet:

- Der Client muss **ständig** nachfragen, ob es was Neues gibt → das nennt man „Polling“.
- Das ist ineffizient, weil 90 % der Anfragen oft mit *„Nein, nichts Neues“* beantwortet werden.

---

### ⚡ **Mit WebSocket kann der Server pushen**

Bei WebSockets darf der Server **jederzeit** von sich aus eine Nachricht an den Client schicken, z. B.:

- *„Hey, hier ist eine neue Chat-Nachricht!“*
- *„Das Spiel hat sich gerade verändert.“*
- *„Ein neuer Börsenkurs ist da.“*

Der Client muss **nicht** vorher fragen, sondern bekommt alles in Echtzeit zugeschickt.

- Der Server prüft, ob er WebSockets unterstützt und ob der Pfad (z. B. `/scoreboard`) passt.
- Wenn ja, antwortet er mit:
    
    ```
    
    HTTP/1.1 101 Switching Protocols
    Upgrade: websocket
    Connection: Upgrade
    Sec-WebSocket-Accept: <hashed-key>
    
    ```
    
- **Code 101** heißt: Ich schalte jetzt auf WebSocket um.

 **Verbindung erfolgreich**

- Nach der 101-Antwort wird die HTTP-Verbindung „gekappt“, und stattdessen läuft nun ein **dauerhafter WebSocket-Datenstrom** über dieselbe TCP-Verbindung.
- Jetzt wird das `onopen`Event ausgelöst.

### **Wann wird die Verbindung beim Handshake gebrochen?**

Der Handshake bricht ab, wenn:

- Der Server keine WebSockets akzeptiert (z. B. weil der Pfad falsch ist).
- Der Server eine andere Antwort als **101** sendet (z. B. 400, 404, 500).
- Ein Load Balancer, Proxy oder Firewall die `Upgrade`Headers blockiert.
- Bei `wss://`: Das TLS-Zertifikat ungültig ist oder der Handshake auf der SSL-Ebene scheitert.
- Netzwerkfehler oder Timeout auftreten (z. B. Server ist nicht erreichbar).

In diesen Fällen:

- Kein `onopen`.
- Stattdessen wird **`onerror`** aufgerufen.
- Danach wird automatisch die Verbindung geschlossen, und `onclose` läuft.

---

### Wie kann ich sowas aber erstellen?

Client Seite 

```tsx
<!DOCTYPE html>
<script>
// Verbindung zum Server aufbauen 
ws = new WebSocket("ws://127.0.0.1/scoreboard") // Local server
// ws = new WebSocket("wss://game.example.com/scoreboard") // Remote server

ws.onopen = () => {
    console.log("Connection opened")
    ws.send("Hi server, please send me the score of yesterday's game")
}

ws.onmessage = (event) => {
    console.log("Data received", event.data)
    ws.close() // We got the score so we don't need the connection anymore
}

ws.onclose = (event) => {
    console.log("Connection closed", event.code, event.reason, event.wasClean)
}

ws.onerror = () => {
    console.log("Connection closed due to error")
}
</script>
```

- Bei `ws://` → unverschlüsselt (Port 80).
- Bei `wss://` → TLS/SSL-verschlüsselt (Port 443).