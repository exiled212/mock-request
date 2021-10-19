<p>
	<a href="https://app.circleci.com/pipelines/github/exiled212/mock-request" target="_blank"><img src="https://circleci.com/gh/exiled212/mock-request/tree/master.svg?style=shield" alt="CircleCI" /></a>
	<a href='https://coveralls.io/github/exiled212/mock-request?branch=master'><img src='https://coveralls.io/repos/github/exiled212/mock-request/badge.svg?branch=master' alt='Coverage Status' /></a>
</p>

# Descripción
Mock-Request es una API que permite crear mocks de otras APIS con mucha facilidad.


# Iniciar aplicación

Puede iniciar la aplicación de dos formas:

- **docker-composer:** De esta forma podra darle una mirada rapida a la aplicación, pero se perdera la información que se guarde siempre que termine los procesos de docker
- **npm:** Iniciar el proyecto desde npm le permitira conectar a la base de datos de su sistema.

## Iniciar con docker-composer

Solo tiene que corre los siguientes comandos:

```bash
$ docker-compose up -d db
$ docker-compose up -d app
```

Ya con esto, solo tiene que verificar que los 3 servicios de docker este arriba con:

```bash
$ docker-compose ps
```

Para cerrar la api solo tiene que usar la siguiente linea de comando:
```bash
$ docker-compose down
```

### **Acceder a la Base de datos de docker:**

Si desea acceder directamente a la base de datos que se crea en docker, puede hacerlo desde pgAdmin4 con el siguiente link: http://localhost:5050/ con las siguientes credenciales de prueba:

***email:*** root@admin.com

***password:*** root


## Iniciar con NPM

Lo primero que tiene que hacer, es crear una copia de ***example.env*** con el nombre ***.env*** y luego remplazamos los valores con los datos de nuestra base de datos.

```bash
$ cp ./example.env ./.env
```

El .env contiene los siguientes envs:

- DB_HOST={host}
- DB_PORT={port}
- DB_NAME={database_name}
- DB_USER={username}
- DB_PASSWORD={password}


Luego construimos los js y corremos la api con los siguientes comandos.

```bash
# build 
$ npm run build

# production mode
$ npm run start:prod
```

## Test

Si desea correr los test, son los siguientes:

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

[MIT licensed](LICENSE).
