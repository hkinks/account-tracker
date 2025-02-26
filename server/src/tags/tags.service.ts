import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './tags.entity';
import { CreateTagDto, TagDto } from './tags.controller';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
  ) {}

  async getTags(): Promise<Tag[]> {
    return await this.tagsRepository.find();
  }

  async getTagById(id: number): Promise<Tag> {
    const tag = await this.tagsRepository.findOne({ where: { id } });
    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }
    return tag;
  }

  async createTag(createTagDto: CreateTagDto): Promise<Tag> {
    const tag = this.tagsRepository.create(createTagDto);
    return await this.tagsRepository.save(tag);
  }

  async updateTag(id: number, tagDto: TagDto): Promise<Tag> {
    const tag = await this.getTagById(id);
    const updatedTag = { ...tag, ...tagDto };
    return await this.tagsRepository.save(updatedTag);
  }

  async deleteTag(id: number): Promise<void> {
    const result = await this.tagsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }
  }
}
