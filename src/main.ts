import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthService } from './auth/auth.service';
import { NestExpressApplication } from '@nestjs/platform-express'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  const authService = app.get(AuthService)
  await authService.createInitialPermissions()
  await authService.createInitialRoles()
  await authService.createInitialUser()

  // Configurar CORS para permitir solicitudes desde localhost:4200
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })

  await app.listen(4001);
}
bootstrap();
