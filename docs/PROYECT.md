# Kara — Documento de Proyecto

> **Kara** es tu asistente personal para el computador, accesible desde cualquier
> canal de comunicación que uses a diario. Combina un **orquestador local con
> IA ligera** que resuelve la mayoría de peticiones en la propia máquina, y
> delega en un **LLM en la nube** sólo cuando de verdad hace falta. Así las
> acciones son rápidas, privadas y el coste en la nube se mantiene bajo.

---

## 1. Visión

Kara nace de una idea simple: **que tu computador pueda escucharte, aunque no
estés frente a él**. En lugar de depender de una sola interfaz (una ventana,
una terminal, un chat), Kara se convierte en un agente presente en cualquiera
de los canales que ya usas — correo, mensajería, llamadas, calendarios,
terminales remotas, webhooks, etc. — y traduce esos mensajes en acciones sobre
tu máquina y tus servicios.

El objetivo explícito es ofrecer un **alto nivel de conectividad multicanal**,
enfocado en un asistente personal instalable, local-first, que el usuario
controla por completo.

### Principios

- **Local-first**: la app corre en tu máquina; tus datos viven contigo.
- **IA local primero, nube cuando toque**: Kara incluye un orquestador local
  con IA ligera (clasificador de intenciones, extracción de entidades,
  enrutado a flujos) que resuelve lo rápido y lo repetitivo sin salir del
  equipo. Sólo escala a un LLM en la nube cuando la tarea lo justifica
  (razonamiento complejo, generación extensa). Objetivo: **menos latencia,
  más privacidad y menor coste cloud**.
- **Determinismo por defecto**: los flujos son declarativos. La IA _decide_,
  pero quien ejecuta acciones es siempre el motor determinista, auditable y
  reversible.
- **Multicanal por diseño**: la misma acción puede dispararse desde Telegram,
  desde la CLI, desde un webhook de GitHub o desde la UI de escritorio.
- **Extensible**: cada capacidad es una _integración_ con un contrato claro.
- **Auditable**: cada evento entra, se procesa y queda registrado, con la
  ruta completa (quién lo clasificó local, si escaló a la nube, qué flujo
  ejecutó).

---

## 2. ¿Qué es Kara, en concreto?

Kara es **una sola aplicación distribuida en tres presentaciones**:

| Presentación          | Qué es                                                               | Para quién                              |
| --------------------- | -------------------------------------------------------------------- | --------------------------------------- |
| **App de escritorio** | Electron que embebe el frontal Next.js y levanta el core localmente. | Usuario final, configuración visual.    |
| **CLI**               | Cliente de terminal para disparar acciones y administrar el core.    | Power users, scripts, automatizaciones. |
| **Core (servidor)**   | API NestJS + Fastify con Prisma/SQLite, encargada de integraciones.  | Motor compartido por escritorio y CLI.  |

Las tres presentaciones **hablan con el mismo core**. El core puede correr:

- Embebido dentro del proceso Electron (uso de escritorio normal).
- Como proceso independiente (por ejemplo, en un mini-server casero, un NAS o
  una máquina "siempre encendida") con CLI y frontal conectándose vía HTTP.

---

## 3. Arquitectura

### 3.1 Visión general

```
                     ┌──────────────────────────────┐
                     │        Canales externos       │
                     │  Telegram · Email · Webhooks  │
                     │  Slack · Discord · WhatsApp   │
                     │  Cron · GitHub · Calendarios  │
                     └──────────────┬───────────────┘
                                    │
                                    ▼
                     ┌──────────────────────────────┐
                     │      Integrations Layer       │
                     │   (adaptadores por canal)     │
                     └──────────────┬───────────────┘
                                    │
                                    ▼
            ┌────────────────────────────────────────────────┐
            │                Kara Core (NestJS)              │
            │  ─ Event bus                                    │
            │  ─ Local AI Orchestrator (fast path)            │
            │       • intención / entidades / enrutado        │
            │       • cache semántica + reglas                │
            │  ─ Cloud LLM Gateway (slow path, opt-in)        │
            │  ─ Rule / Workflow engine (determinista)        │
            │  ─ Action executor                              │
            │  ─ Integrations registry                        │
            │  ─ Persistence (Prisma + SQLite)                │
            │  ─ Auth / Policy                                │
            └─────┬───────────────────────┬───────────────────┘
                  │                       │
         ┌────────▼─────────┐    ┌────────▼────────┐
         │  Frontend Next   │    │      CLI        │
         │ (embebido en     │    │  (@kara/cli)    │
         │  Electron)       │    │                 │
         └──────────────────┘    └─────────────────┘
```

### 3.2 Módulos principales del core

- **Event Bus**: normaliza mensajes entrantes (mail, Telegram, webhook) a un
  evento común `KaraEvent { source, channel, payload, identity, timestamp }`.
- **Local AI Orchestrator (fast path)**: capa de IA ligera que corre en el
  propio equipo. Clasifica la intención del evento, extrae entidades y
  decide si puede resolverlo con un flujo existente, cache o reglas. La
  mayoría del tráfico se queda aquí.
- **Cloud LLM Gateway (slow path)**: se usa sólo cuando el orquestador
  local marca la petición como compleja o ambigua. Centraliza proveedores
  (OpenAI, Anthropic, etc.), aplica presupuesto y rate limits, y registra
  coste por petición.
- **Integrations Registry**: catálogo de integraciones instalables. Cada una
  expone _triggers_ (eventos que emite) y _actions_ (operaciones que puede
  ejecutar).
- **Workflow Engine**: ejecuta flujos declarados (JSON/YAML) que encadenan
  triggers → condiciones → acciones. Es determinista: la IA propone, el
  motor dispone.
- **Action Executor**: aplica las acciones resueltas por el workflow engine
  (enviar email, ejecutar shell script, crear archivo, llamar a una API, etc.).
- **Policy / Auth**: control de qué integraciones pueden ejecutar qué
  acciones, con allowlists por canal e identidad. Incluye políticas
  específicas para el Cloud LLM Gateway (qué datos pueden salir a la nube).
- **Persistence**: Prisma sobre SQLite (`better-sqlite3`) — perfecto para
  local-first. Guarda eventos, workflows, credenciales cifradas, historial,
  embeddings y caches semánticas de la capa local de IA.
- **API pública**: REST sobre Fastify, consumida por la UI de Next.js y la
  CLI.

---

## 3.3 Orquestador local de IA y ahorro en la nube

Kara incorpora un **orquestador local con IA** como primera capa de decisión.
Su trabajo no es generar texto bonito, sino **resolver rápido lo previsible**
y evitar llamadas innecesarias a proveedores cloud.

### Por qué

- **Latencia**: una respuesta local ronda decenas de milisegundos; un LLM
  cloud, segundos.
- **Coste**: cada llamada a la nube se paga. Si el 80 % de las peticiones
  son repetitivas ("recuérdame a las 18", "guarda esto en notas", "enciende
  el salón"), no tiene sentido pagarlas.
- **Privacidad**: muchas peticiones contienen datos personales que no deben
  salir del equipo.
- **Disponibilidad**: sigue funcionando aunque no haya internet para lo
  esencial.

### Qué hace el orquestador local

1. **Clasificación de intención** con un modelo pequeño embebido
   (clasificadores ligeros, embeddings locales, reglas).
2. **Extracción de entidades** (fechas, contactos, rutas, importes,
   identificadores de integraciones).
3. **Búsqueda semántica** sobre workflows, plantillas y respuestas
   anteriores cacheadas.
4. **Enrutado**:
   - Si hay un flujo existente que encaja → lo ejecuta directo.
   - Si hay una respuesta cacheada equivalente → la reutiliza.
   - Si la confianza es baja o la tarea requiere razonamiento/generación
     extensa → escala al **Cloud LLM Gateway**.
5. **Aprendizaje barato**: guarda pares _(intención → flujo)_ validados por
   el usuario para resolverlos localmente la próxima vez.

### Cloud LLM Gateway (slow path)

Cuando sí hace falta un LLM grande:

- Centraliza proveedores (OpenAI, Anthropic, Azure OpenAI, compatibles
  OpenAI self-hosted).
- Aplica **presupuesto** (por día/mes) y **rate limiting**.
- Registra por petición: proveedor, modelo, tokens, coste, latencia,
  canal origen.
- Permite **políticas de datos**: qué campos pueden viajar, redacción
  automática de PII antes de enviar.
- Puede usarse en modo _streaming_ hacia la UI o CLI.

### Estimación de ahorro

El orquestador local está diseñado para absorber la mayor parte del tráfico
repetitivo. En un uso típico de asistente personal, ese tráfico suele ser
dominante, con lo que el gasto en la nube queda reservado a las peticiones
que realmente necesitan un LLM grande. El panel de la UI muestra el ratio
_local vs. cloud_ y el coste acumulado para que el usuario lo controle.

---

## 4. Capas del monorepo

El repositorio es un monorepo gestionado con **pnpm workspaces** y
**Turborepo**.

```
apps/
  core/       → Servidor NestJS (Fastify + Prisma + SQLite)
  web/        → Frontal Next.js (App Router)
  electron/   → Envoltorio de escritorio que levanta core + web
  cli/        → Cliente CLI de administración y ejecución
packages/
  tsconfig/   → Presets de tsconfig compartidos
docs/         → Documentación (este archivo)
```

### 4.1 `apps/core` — Servidor

- **Framework**: [NestJS 11](https://nestjs.com/) sobre
  [Fastify](https://fastify.dev/).
- **ORM**: [Prisma 7](https://www.prisma.io/) con adapter
  `@prisma/adapter-better-sqlite3`.
- **Base de datos**: SQLite local, gestionada por migraciones Prisma.
- **Documentación API**: Swagger (`@nestjs/swagger`).
- **Validación**: `class-validator` + `class-transformer`.
- **Responsabilidades**:
  - Exponer la API que consumen UI y CLI.
  - Registrar y ejecutar integraciones.
  - Persistir eventos, flujos, credenciales y resultados.
  - Ser el único lugar con acceso al sistema de archivos y al sistema
    operativo: los demás apps llaman al core.

### 4.2 `apps/web` — Frontal

- **Framework**: [Next.js](https://nextjs.org/) App Router + React 19.
- **Estilo**: Tailwind, siguiendo el sistema definido en
  [system.design.md](system.design.md) (dark-first, atómico).
- **Propósito**:
  - Panel de control visual: integraciones, workflows, logs, eventos.
  - Editor de flujos declarativos.
  - Chat composer para interactuar con Kara desde la propia UI.
- Se renderiza _dentro_ de Electron, pero también puede servirse de forma
  independiente apuntando a un core remoto.

### 4.3 `apps/electron` — Escritorio

- Envuelve el frontal Next.js.
- Supervisa el ciclo de vida del core:
  - Lo arranca al abrir la app.
  - Lo apaga limpiamente al cerrar.
  - Expone un tray/menú con estado, acciones rápidas y acceso a logs.
- **Objetivo**: que el usuario final abra un icono y todo esté listo, sin
  tocar terminal.

### 4.4 `apps/cli` — Línea de comandos

- Cliente que habla con el core vía HTTP local.
- Pensado para:
  - Scripts y automatizaciones (cron, CI).
  - Power users que prefieren terminal.
  - Diagnóstico y mantenimiento (`kara doctor`, `kara logs`, `kara run`).
- Se puede usar **sin abrir Electron**: el core puede correr como daemon.

---

## 5. Modelo de integraciones

La pieza central de Kara es su sistema de integraciones. El objetivo es cubrir
un catálogo amplio de canales y servicios, adaptados a una app personal.

### 5.1 Categorías objetivo

- **Mensajería**: Telegram, WhatsApp, Signal, Slack, Discord, Matrix.
- **Email**: IMAP/SMTP, Gmail, Outlook.
- **Calendario y tareas**: Google Calendar, iCal, Todoist, Notion, Obsidian.
- **Código y dev**: GitHub, GitLab, Jira, Linear, Sentry.
- **Archivos y nube**: Dropbox, Google Drive, OneDrive, S3 / MinIO, carpeta
  local.
- **Sistema operativo**: shell, procesos, notificaciones nativas, atajos.
- **Web y automatización**: Webhooks genéricos, HTTP requests, scraping,
  RSS.
- **Hogar / IoT**: Home Assistant, MQTT, Zigbee2MQTT.
- **Audio/voz**: captura de voz local, TTS externo, transcripción vía API.
- **IA externa (opcional)**: OpenAI, Anthropic, modelos self-hosted — se
  invocan mediante el **Cloud LLM Gateway** sólo cuando el orquestador local
  no resuelve. La IA siempre _propone_ (clasifica, sugiere flujos, rellena
  parámetros); nunca ejecuta por sí misma.

### 5.2 Contrato de una integración

Cada integración es un paquete con una forma común:

```ts
export interface Integration {
  id: string; // "telegram"
  name: string; // "Telegram"
  version: string;
  triggers?: TriggerDefinition[]; // eventos que emite
  actions?: ActionDefinition[]; // acciones que expone
  config: ConfigSchema; // credenciales / settings
  lifecycle: {
    onInstall?(): Promise<void>;
    onEnable?(ctx: Ctx): Promise<void>;
    onDisable?(ctx: Ctx): Promise<void>;
  };
}
```

- **Triggers** empujan eventos normalizados al event bus del core.
- **Actions** se invocan desde workflows o directamente desde UI/CLI.
- **Config** se persiste cifrada en SQLite.
- **Lifecycle** permite suscribirse a webhooks, abrir sockets, etc.

### 5.3 Ejemplo conceptual

> _"Cuando reciba un email con la etiqueta `factura`, guarda el adjunto en
> `~/Documentos/Facturas/YYYY/MM`, envíame un Telegram con el total y añade
> una tarea a Todoist."_

Eso se traduce en un workflow declarativo:

```yaml
trigger:
  integration: email
  event: message.labeled
  filter:
    label: factura

steps:
  - action: filesystem.save-attachment
    with:
      path: "~/Documentos/Facturas/{{ event.date | date('yyyy/MM') }}"

  - action: telegram.send
    with:
      chatId: "{{ me }}"
      text: "Nueva factura de {{ event.from }} — total: {{ event.amount }}"

  - action: todoist.create-task
    with:
      content: "Revisar factura {{ event.subject }}"
      dueString: "friday"
```

El flujo en sí es determinista. La IA local sólo interviene _antes_: traduce
el mensaje entrante (“guarda esta factura”) a este flujo, y — si hiciera
falta extraer el importe del PDF — puede invocar el **Cloud LLM Gateway**
como una _action_ más, sujeta a política de datos.

---

## 6. Canales de comunicación del usuario

Uno de los objetivos que nos diferencia: **hablar con Kara desde donde estés**.
Los canales soportados son, a la vez, integraciones de entrada:

- Telegram / WhatsApp / Signal / Slack / Discord: envías un mensaje y el
  orquestador local de Kara lo interpreta. Soporta tanto comandos con
  sintaxis estricta como lenguaje natural sencillo; si la intención es
  ambigua o compleja, escala al Cloud LLM Gateway.
- Email: `asunto` = comando, `cuerpo` = parámetros.
- Webhooks: cualquier servicio puede llamar a un endpoint firmado.
- CLI: `kara run <comando>`.
- UI de escritorio: formularios, editor de flujos, chat.
- Cron / timer interno: Kara se habla a sí misma.

Cada canal pasa por la misma tubería:
**Canal → Adaptador → Evento normalizado → Política → Workflow → Acciones**.

---

## 7. Stack técnico

| Capa              | Tecnología                                 |
| ----------------- | ------------------------------------------ |
| Lenguaje          | TypeScript                                 |
| Runtime           | Node.js 22 LTS                             |
| Gestor paquetes   | pnpm 10 (workspaces)                       |
| Orquestador       | Turborepo                                  |
| Backend           | NestJS 11 + Fastify                        |
| Persistencia      | Prisma 7 + SQLite (`better-sqlite3`)       |
| Frontend          | Next.js (App Router) + React 19 + Tailwind |
| Escritorio        | Electron                                   |
| CLI               | Node + TypeScript                          |
| Validación        | `class-validator`, `zod` (según capa)      |
| Documentación API | Swagger                                    |
| Testing           | Jest                                       |
| Lint/format       | ESLint + Prettier                          |

---

## 8. Flujos de arranque

### 8.1 Escritorio (usuario final)

1. El usuario abre la app Electron.
2. Electron lanza el core NestJS como proceso hijo (o in-process).
3. Electron carga la UI Next.js apuntando al core local (`http://127.0.0.1`).
4. Al cerrar la ventana, el core hace shutdown limpio (desuscribe webhooks,
   guarda estado).

### 8.2 Modo servidor + CLI

1. `pnpm --filter @kara/core start` en una máquina siempre encendida.
2. Desde el portátil o móvil, `kara --host http://home.local:3001 run ...`.
3. Electron opcional: puede apuntar a ese core remoto en lugar del local.

### 8.3 Modo desarrollo

- `pnpm --filter @kara/core dev` — servidor con hot reload.
- `pnpm --filter @kara/web dev` — frontal Next.
- `pnpm --filter @kara/electron dev` — desktop apuntando a los anteriores.
- `pnpm --filter @kara/cli dev` — CLI en modo watch.

---

## 9. Seguridad y privacidad

- **Local-first**: la base de datos, credenciales y logs viven en la máquina
  del usuario.
- **Credenciales cifradas** en reposo (clave derivada del sistema).
- **Política por integración**: cada integración declara los permisos que
  necesita; el core los hace cumplir.
- **Firmado de webhooks** y tokens rotables para canales externos.
- **Auditoría**: cada evento/acción queda registrado con timestamp, origen y
  resultado.
- **Sin telemetría por defecto**. Si se añade, es opt-in y anonimizada.

---

## 10. Diferenciales de Kara

Kara se apoya en tres ideas clave:

1. **Integraciones como ciudadano de primera clase**: todo lo interesante
   pasa en las conexiones con otros sistemas.
2. **Accionabilidad multicanal**: el asistente vive donde vive el usuario,
   no al revés.
3. **Transparencia**: el usuario ve qué disparó qué y puede inspeccionarlo.

Además, se diferencia por:

- Ser **instalable** en tu máquina y **local-first**.
- Tener un **orquestador local con IA** que resuelve la mayoría de
  peticiones sin salir del equipo, reservando el LLM en la nube para lo
  realmente complejo. Esto baja coste y latencia y sube privacidad.
- **Unificar** escritorio, CLI y servidor en una sola base de código.

---

## 11. Estado actual

- [x] Monorepo (pnpm + turbo) con apps `core`, `web`, `electron`, `cli`.
- [x] Core NestJS + Fastify arrancando con Prisma + SQLite
      (`better-sqlite3`).
- [x] Configuración base de Electron envolviendo la web.
- [x] CLI mínima con comando `start`.
- [x] Sistema de diseño inicial (ver [system.design.md](system.design.md)).
- [ ] Registry de integraciones.
- [ ] Orquestador local de IA (clasificador + embeddings + cache).
- [ ] Cloud LLM Gateway con presupuesto y política de datos.
- [ ] Workflow engine declarativo (YAML/JSON).
- [ ] Primer set de integraciones (Telegram, Email, Webhooks, Shell).
- [ ] Panel de workflows y panel de coste IA en la UI.
- [ ] Empaquetado y firma de la app de escritorio.

---

## 12. Roadmap propuesto

### Fase 1 — Fundaciones

- Estabilizar core, CLI y Electron en Windows, macOS y Linux.
- Definir contrato `Integration` y cargarlas dinámicamente.
- Event bus + auditoría persistente.

### Fase 2 — Primer núcleo de integraciones

- Telegram (trigger + action).
- Email IMAP/SMTP.
- Webhooks entrantes firmados.
- Shell/filesystem local.
- Cron interno.

### Fase 3 — Workflow engine + IA local

- DSL declarativo (YAML).
- Editor visual en la UI.
- Plantillas listas para usar.
- Orquestador local: clasificador de intenciones, embeddings,
  cache semántica y reglas de enrutado.

### Fase 4 — Expansión de integraciones + Cloud LLM Gateway

- Slack, Discord, WhatsApp.
- GitHub, Linear, Notion, Todoist.
- Home Assistant / MQTT.
- Gateway multi-proveedor con presupuesto, rate limit y política de datos.

### Fase 5 — Distribución

- Instaladores firmados (dmg, msi, AppImage).
- Auto-update.
- Marketplace de integraciones y workflows.

---

## 13. Glosario

- **Integración**: módulo que conecta a Kara con un servicio externo
  (Telegram, Gmail, GitHub…).
- **Trigger**: evento emitido por una integración.
- **Action**: operación ejecutable expuesta por una integración.
- **Workflow**: secuencia declarativa de `trigger → condiciones → actions`.
- **Core**: servidor NestJS con el event bus, la persistencia y el ejecutor.
- **Canal**: vía por la que el usuario habla con Kara (Telegram, CLI, UI…).
- **Orquestador local de IA (fast path)**: capa local que clasifica
  intenciones, extrae entidades y enruta a flujos o caches sin salir del
  equipo.
- **Cloud LLM Gateway (slow path)**: componente que habla con LLMs en la
  nube cuando el orquestador local no resuelve, con presupuesto y política
  de datos.
- **Policy**: reglas que deciden qué integraciones pueden ejecutar qué
  acciones para qué identidad, y qué datos pueden salir a la nube.

---

## 14. Filosofía

> Kara no decide por ti: **ejecuta por ti**, donde tú estés, con reglas que
> tú defines. La IA local resuelve lo rápido; la nube aparece sólo cuando
> aporta valor. La inteligencia es una herramienta; la confiabilidad no es
> negociable.
