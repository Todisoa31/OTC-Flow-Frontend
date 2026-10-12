# OTC FLOW 

## Lancer le serveur
- ### En locale
  - Il faut d'abord faire un copy de .env.*.exemple ou cree un .env 
```bash
    cp .env.stagin.exemple .env
```

  - lancer le serveur avec npm, yarn, pnpm etc ...
```bash
    yarn dev
    npm run dev
    pnpm run dev
```

### Dans le serveur stagin
  - Il faut d'abord faire un copy de .env.*.exemple ou cree un .env 
```bash
    cp .env.stagin.exemple .env
```

## Instruction de maj dans le serveur *STAGIN* / *
1 - git pull
2 - changer la version NEXT_DEPLOY_VERSION dans le .env dans le serveur 
3 - cree un build pour la nouvelle version : 
```bash
  docker build -f Dockerfile.dev -t  otcflow-frontend:v1.0 . 
  docker compose -f docker-compose.dev.yml down
  docker compose -f docker-compose.dev.yml up -d
```

#### En cas de bug on change la NEXT_DEPLOY_VERSION par la derniere version de l'image
#### par exemple la derniere version etait : otcflow-frontend:v0.9 alors on met v0.9 sur NEXT_DEPLOY_VERSION
#### lancer la cmd
```bash
  docker compose -f docker-compose.dev.yml up -d
```

## DOCUMENTATION DE CODE
- Centre de redirection 'function'
/src/utils/withAuth.tsx ==> redirect

<!-- Security scan triggered at 2025-09-02 00:30:40 -->