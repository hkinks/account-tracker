import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { TagsService } from './tags.service';
import { Tag } from './tags.entity';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTagDto {
  @ApiProperty({ example: 'groceries' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 'Grocery shopping expenses', required: false })
  @IsString()
  description?: string;

  @ApiProperty({ example: '#00FF00', required: false })
  @IsString()
  color?: string;
}

export class TagDto {
  id: number;
  name: string;
  description?: string;
  color?: string;
}

@Controller('tags')
export class TagsController {
  constructor(
    private readonly tagsService: TagsService
  ) {}
  
  @Get()
  async getTags(): Promise<TagDto[]> {
    return await this.tagsService.getTags();
  }

  @Get(':id')
  async getTagById(@Param('id') id: number): Promise<TagDto> {
    return await this.tagsService.getTagById(id);
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async createTag(@Body() tag: CreateTagDto): Promise<TagDto> {
    console.log('Creating tag:', tag);
    return await this.tagsService.createTag(tag);
  }

  @Put(':id')
  async updateTag(@Param('id') id: number, @Body() tag: TagDto): Promise<TagDto> {
    return await this.tagsService.updateTag(id, tag);
  }

  @Delete(':id')
  async deleteTag(@Param('id') id: number): Promise<void> {
    console.log('Deleting tag with id:', id);
    await this.tagsService.deleteTag(id);
  }
} 