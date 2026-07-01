# Mejoras: Framer Motion + Skill UI/UX Pro Max

Resumen de lo que pediste y cómo dejarlo 100% listo. Las dos instalaciones
deben correrse en **tu terminal de Windows** (no se pueden hacer desde el chat
por seguridad y por compatibilidad de binarios).

## Opción rápida (recomendada)
Hacé doble clic en **`setup-mejoras.bat`** (está en esta misma carpeta).
Hace los dos pasos solos. Necesita Python 3.x instalado para la skill.

## O paso a paso, manual

### 1) Framer Motion ("motion")
Tu proyecto **YA tiene** `framer-motion@11.18.2` instalado y en uso
(`app/casos`, `app/contacto`, `app/servicios`). El paquete `motion` es el
mismo proyecto con el nombre nuevo (motion.dev). Si querés sumarlo igual:

```bash
cd "ruta/a/pagina-web-nexa"
npm install motion
```

- Con `framer-motion` actual importás así:  `import { motion } from "framer-motion"`
- Con el paquete `motion` nuevo (v12) sería: `import { motion } from "motion/react"`

No hace falta migrar nada si ya te funciona; conviven sin problema.

### 2) Skill UI/UX Pro Max
Repo: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill

**Para Claude Code** (vía CLI, queda global para todos tus proyectos):
```bash
npm install -g uipro-cli
uipro init --ai claude --global    # instala en ~/.claude/skills/
```
Requiere **Python 3.x**. Verificá con `python3 --version` (o `python --version`).

**Para Claude Code** (vía marketplace, dentro de Claude Code):
```
/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
/plugin install ui-ux-pro-max@ui-ux-pro-max-skill
```

**Para Cowork (este chat):** las skills de Cowork se gestionan desde
**Settings → Capabilities**. La activación no se puede hacer desde dentro de la
conversación; entrá ahí y habilitá la skill para que se auto-active en tus
próximos desarrollos.

## Verificación
- `npm ls motion framer-motion` → muestra las versiones instaladas.
- Pedile a tu asistente: "Build a landing page for my SaaS" → si la skill está
  activa, genera un design system completo (colores, tipografía, estilo).
