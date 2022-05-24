/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches, IsEmail } from 'class-validator';
import { BaseDTO } from './base.dto';
import { IsString } from 'class-validator';


import { InfluenciadorDTO } from './influenciador.dto';

import { UserDTO } from './user.dto';
import { Exclude } from 'class-transformer';

export class TypeEmpresaDTO extends BaseDTO {

    @ApiModelProperty({ uniqueItems: true, example: 'myuser', description: 'User login' })
    @IsString()
    login: string;

    @ApiModelProperty({ example: 'MyUser', description: 'User first name', required: false })
    firstName?: string;

    @ApiModelProperty({ example: 'MyUser', description: 'User last name', required: false })
    lastName?: string;

    @ApiModelProperty({ example: 'myuser@localhost.it', description: 'User email' })
    @IsEmail()
    email: string;

    @ApiModelProperty({ example: 'true', description: 'User activation', required: false })
    activated?: boolean;

    @ApiModelProperty({ example: 'en', description: 'User language', required: false })
    langKey?: string;

    @ApiModelProperty({
        isArray: true,
        enum: ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_ANONYMOUS'],
        description: 'Array of permissions',
        required: false,
    })
    authorities?: any[];

    @Exclude()
    @ApiModelProperty({ example: 'myuser', description: 'User password' })
    password: string;

    @ApiModelProperty({ example: 'http://my-image-url', description: 'Image url', required: false })
    imageUrl?: string;

    activationKey?: string;

    resetKey?: string;

    resetDate?: Date;
    @IsNotEmpty()
    @ApiModelProperty({ description: 'nome field' })
    nome: string;

    @ApiModelProperty({ description: 'regiao field', required: false })
    regiao: string;

    @ApiModelProperty({ description: 'nicho field', required: false })
    nicho: string;

    @ApiModelProperty({ description: 'site field', required: false })
    site: string;

    @ApiModelProperty({ type: UserDTO, description: 'user relationship' })
    user: UserDTO;

    @ApiModelProperty({ type: InfluenciadorDTO, isArray: true, description: 'influenciadors relationship' })
    influenciadors: InfluenciadorDTO[];


}
