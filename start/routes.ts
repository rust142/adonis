/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { HttpContext } from '@adonisjs/core/http'

import router from '@adonisjs/core/services/router'

import config from '@adonisjs/core/services/config'
import env from '#start/env'

const ResourcesController = () => import('#controllers/resources_controller')
const ResourceExceptsController = () => import('#controllers/resource_excepts_controller')
const ResourceOnliesController = () => import('#controllers/resources_controller')

router.on('/').render('pages/home')

router
  .get('/config', ({ response }: HttpContext) => {
    return response.json({
      config: {
        app_name: config.get('app.appName'),
        http_cookie: config.get('app.http.cookie'),
      },
    })
  })
  .as('config')

router
  .get('/env', ({ response }: HttpContext) => {
    return response.json({
      env: {
        host: env.get('HOST'),
        port: env.get('PORT'),
      },
    })
  })
  .as('env')

router
  .group(() => {
    router
      .group(() => {
        router.resource('resource', ResourcesController).as('resource')
        router
          .resource('resource-only', ResourceOnliesController)
          .only(['index', 'store', 'update', 'destroy'])
          .as('resource.only')
        router
          .resource('resource-except', ResourceExceptsController)
          .except(['create', 'edit'])
          .as('resource.except')
      })
      .prefix('route')
  })
  .prefix('dashboard')
