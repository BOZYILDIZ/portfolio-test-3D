# Portfolio 3D Intelligent

[![CI](https://github.com/BOZYILDIZ/portfolio-test-3D/actions/workflows/ci.yml/badge.svg)](https://github.com/BOZYILDIZ/portfolio-test-3D/actions/workflows/ci.yml)

Application React + Vite mettant en avant un portfolio 3D interactif basé sur `three`, `@react-three/fiber` et `@react-three/drei`, avec animations via `gsap`.

## Prérequis

- Node.js ≥ 18
- pnpm (recommandé, un `pnpm-lock.yaml` est présent)

## Installation

```bash
pnpm install
```

## Scripts

- `pnpm dev` : démarre le serveur de développement Vite
- `pnpm build` : génère la build de production
- `pnpm preview` : prévisualise la build localement
- `pnpm lint` : exécute ESLint

## Démarrage rapide

```bash
pnpm install
pnpm dev
```

## Pile technique

- React 19
- Vite 7
- three.js, @react-three/fiber, @react-three/drei
- GSAP
- ESLint (configuration de base fournie)

## Intégration Continue

Un workflow GitHub Actions vérifie le lint et la build à chaque push et pull request sur `main`.

## Déploiement

Le projet peut être déployé sur GitHub Pages, Netlify ou Vercel. Pour Pages avec Vite, vous pouvez utiliser `vite build` puis publier le dossier `dist/`.
