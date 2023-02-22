[![Node.js CI](https://github.com/lachouettecoop/planning/actions/workflows/node.js.yml/badge.svg)](https://github.com/lachouettecoop/planning/actions/workflows/node.js.yml)

# Planning

Web app for [La Chouette Coop](https://lachouettecoop.fr/), bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Poste accueil

Pour setter les valeur par défaut du login du poste accueil, sur site et sur le site, ouvrir les dev tools (F12) et taper dans la console :

```
localStorage.lcc_defaultLogin = "login_du_poste_accueil"
localStorage.lcc_defaultPassword = "mdp_du_poste_accueil"
```

## Requirements

- [Node](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)

## Setup

    cp {example,}.env
    yarn

## [Commands](https://create-react-app.dev/docs/available-scripts/)

- `yarn start`: start development mode
- `yarn lint`: check linting (TypeScript + Eslint + Prettier)
- `yarn build`: make production bundle in the `build` folder
- `yarn test`: start the test runner in the interactive watch mode
- `yarn eject`: see [documentation](https://create-react-app.dev/docs/available-scripts/#npm-run-eject)
