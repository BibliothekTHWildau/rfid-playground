# RFID playground

A web application to read or write rfid tags based on ISO15693 (HF command set) and ISO28560-3 (data structure). 

In order to work, an additional backend application is needed, which implements the used APIs:

https://github.com/BibliothekTHWildau/node-rfid-server


![Screenshot](https://github.com/BibliothekTHWildau/rfid-playground/blob/main/screenshot.png?raw=true)

# essentials

## Project setup

```
# yarn
yarn

# npm
npm install

# pnpm
pnpm install
```

### Compiles and hot-reloads for development

```vite```

```
# yarn
yarn dev

# npm
npm run dev

# pnpm
pnpm dev
```

### Compiles and minifies for production

```vite build```

```
# yarn
yarn build

# npm
npm run build

# pnpm
pnpm build
```

### Lints and fixes files

```
# yarn
yarn lint

# npm
npm run lint

# pnpm
pnpm lint
```

### Customize configuration

See [Configuration Reference](https://vitejs.dev/config/).
