import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Permission } from "src/permissions/entities/permission.entity";
import { Role } from "src/roles/entities/role.entity";
import { User } from "src/users/entities/user.entity";
import { AuthService } from "./auth.service";
import { InitialPermissionsController } from "./auth.InitialPermissionsController";

@Module({
    imports: [
      TypeOrmModule.forFeature([
        User, 
        Permission, 
        Role
      ]),
    ],
    controllers: [
      InitialPermissionsController
    ],
    providers: [AuthService],
  })
  export class AuthModule {}