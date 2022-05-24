import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { EmpresaDTO } from '../service/dto/empresa.dto';
import { EmpresaMapper } from '../service/mapper/empresa.mapper';
import { EmpresaRepository } from '../repository/empresa.repository';
import { TypeEmpresaDTO } from './dto/type-empresa.dto';

const relationshipNames = [];
relationshipNames.push('influenciadors');

@Injectable()
export class EmpresaService {
    logger = new Logger('EmpresaService');

    constructor(@InjectRepository(EmpresaRepository) private empresaRepository: EmpresaRepository) {}

    async findById(id: number): Promise<EmpresaDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.empresaRepository.findOne(id, options);
        return EmpresaMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<EmpresaDTO>): Promise<EmpresaDTO | undefined> {
        const result = await this.empresaRepository.findOne(options);
        return EmpresaMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<EmpresaDTO>): Promise<[EmpresaDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.empresaRepository.findAndCount(options);
        const empresaDTO: EmpresaDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(empresa => empresaDTO.push(EmpresaMapper.fromEntityToDTO(empresa)));
            resultList[0] = empresaDTO;
        }
        return resultList;
    }

    async save(empresaDTO: EmpresaDTO, creator?: string): Promise<EmpresaDTO | undefined> {
        const entity = EmpresaMapper.fromDTOtoEntity(empresaDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.empresaRepository.save(entity);
        return EmpresaMapper.fromEntityToDTO(result);
    }

    
    async update(empresaDTO: EmpresaDTO, updater?: string): Promise<EmpresaDTO | undefined> {
        const entity = EmpresaMapper.fromDTOtoEntity(empresaDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.empresaRepository.save(entity);
        return EmpresaMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.empresaRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
