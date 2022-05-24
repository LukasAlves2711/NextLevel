/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Body,
    Param,
    Post,
    Res,
    UseGuards,
    Controller,
    Get,
    Logger,
    Req,
    UseInterceptors,
    ClassSerializerInterceptor,
    InternalServerErrorException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthGuard, Roles, RoleType, RolesGuard } from '../../security';
import { PasswordChangeDTO } from '../../service/dto/password-change.dto';
import { UserDTO } from '../../service/dto/user.dto';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { AuthService } from '../../service/auth.service';
import { TypeEmpresaDTO } from '../../service/dto/type-empresa.dto';
import { EmpresaDTO } from '../../service/dto/empresa.dto';
import { EmpresaService } from '../../service/empresa.service';
import { TypeInfluenciadorDTO } from '../../service/dto/type-influenciador.dto';
import { InfluenciadorService } from '../../service/influenciador.service';
import { InfluenciadorDTO } from '../../service/dto/influenciador.dto';

@Controller('api')
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiUseTags('account-resource')
export class AccountController {
    logger = new Logger('AccountController');

    constructor(
        private readonly authService: AuthService,
        private readonly empresaService: EmpresaService,
        private readonly influenciadorService: InfluenciadorService
    ) {}

    @Post('/register')
    @ApiOperation({ title: 'Register user' })
    @ApiResponse({
        status: 201,
        description: 'Registered user',
        type: UserDTO,
    })
    async registerAccount(@Req() req: Request, @Body() userDTO: UserDTO & { password: string }): Promise<any> {
        return await this.authService.registerNewUser(userDTO);
    }

    //Regiter company
    @Post('/register/company')
    @ApiOperation({ title: 'Register company' })
    @ApiResponse({
        status: 201,
        description: 'Registered company',
        type: UserDTO,
    })
    async registerCompany(@Req() req: Request, @Body() typeEmpresaDTO: TypeEmpresaDTO & { password: string }): Promise<any> {
        let userDTO: UserDTO = {
            login: typeEmpresaDTO.login,
            langKey: typeEmpresaDTO.langKey,
            email: typeEmpresaDTO.email,
            password: typeEmpresaDTO.password
        }
            
        const resultUser = await this.authService.registerNewUser(userDTO);
        
        let companyDTO: EmpresaDTO = {
            nome: typeEmpresaDTO.nome,
            regiao: typeEmpresaDTO.regiao,
            nicho: typeEmpresaDTO.nicho,
            site: typeEmpresaDTO.site,
            user: resultUser,
            influenciadors: null
        }

        const resultCompany = await this.empresaService.save(companyDTO, resultUser.login);
        return resultUser;
    }

    //Regiter influencer
    @Post('/register/influencer')
    @ApiOperation({ title: 'Register influencer' })
    @ApiResponse({
        status: 201,
        description: 'Registered influencer',
        type: UserDTO,
    })
    async registerInfluencer(@Req() req: Request, @Body() typeInfluenciadorDTO: TypeInfluenciadorDTO & { password: string }): Promise<any> {
        let userDTO: UserDTO = {
            login: typeInfluenciadorDTO.login,
            langKey: typeInfluenciadorDTO.langKey,
            email: typeInfluenciadorDTO.email,
            password: typeInfluenciadorDTO.password
        }
            
        const resultUser = await this.authService.registerNewUser(userDTO);
        
        let influencerDTO: InfluenciadorDTO = {
            nome: typeInfluenciadorDTO.nome,
            email: typeInfluenciadorDTO.email,
            regiao: typeInfluenciadorDTO.regiao,
            bio: typeInfluenciadorDTO.bio,
            redes: typeInfluenciadorDTO.redes,
            user: resultUser,
            empresas: null,
        }

        const resultInfluence = await this.influenciadorService.save(influencerDTO, resultUser.login);
        return resultUser;
    }

    @Get('/activate')
    @ApiBearerAuth()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Activate an account' })
    @ApiResponse({
        status: 200,
        description: 'activated',
    })
    activateAccount(@Param() key: string, @Res() res: Response): any {
        throw new InternalServerErrorException();
    }

    @Get('/authenticate')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOperation({ title: 'Check if the user is authenticated' })
    @ApiResponse({
        status: 200,
        description: 'login authenticated',
    })
    isAuthenticated(@Req() req: Request): any {
        const user: any = req.user;
        return user.login;
    }

    @Get('/account')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOperation({ title: 'Get the current user.' })
    @ApiResponse({
        status: 200,
        description: 'user retrieved',
    })
    async getAccount(@Req() req: Request): Promise<any> {
        const user: any = req.user;
        const userProfileFound = await this.authService.getAccount(user.id);
        return userProfileFound;
    }

    @Post('/account')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOperation({ title: 'Update the current user information' })
    @ApiResponse({
        status: 201,
        description: 'user info updated',
        type: UserDTO,
    })
    async saveAccount(@Req() req: Request, @Body() newUserInfo: UserDTO): Promise<any> {
        const user: any = req.user;
        return await this.authService.updateUserSettings(user.login, newUserInfo);
    }

    @Post('/account/change-password')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOperation({ title: 'Change current password' })
    @ApiResponse({
        status: 201,
        description: 'user password changed',
        type: PasswordChangeDTO,
    })
    async changePassword(@Req() req: Request, @Body() passwordChange: PasswordChangeDTO): Promise<any> {
        const user: any = req.user;
        return await this.authService.changePassword(
            user.login,
            passwordChange.currentPassword,
            passwordChange.newPassword,
        );
    }

    @Post('/account/reset-password/init')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOperation({ title: 'Send an email to reset the password of the user' })
    @ApiResponse({
        status: 201,
        description: 'mail to reset password sent',
        type: 'string',
    })
    requestPasswordReset(@Req() req: Request, @Body() email: string, @Res() res: Response): any {
        throw new InternalServerErrorException();
    }

    @Post('/account/reset-password/finish')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOperation({ title: 'Finish to reset the password of the user' })
    @ApiResponse({
        status: 201,
        description: 'password reset',
        type: 'string',
    })
    finishPasswordReset(@Req() req: Request, @Body() keyAndPassword: string, @Res() res: Response): any {
        throw new InternalServerErrorException();
    }
}
