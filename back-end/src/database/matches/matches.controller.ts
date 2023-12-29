import { MatchDto } from './matches.dto';
import { MatchesService } from './matches.service';
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {
  }

  // @Get()
  // async findAll() {
  //   return await this.matchesService.findAll();
  // }

  // @Get(':id')
  // async findOne(@Param('id') id: string) {
  //   return await this.matchesService.findOne(Number(id));
  // }

  @Post()
  async create(@Body() createMatchDto: MatchDto) {
    return await this.matchesService.create(createMatchDto);
  }

  // @Put(':id')
  // async update(@Param('id') id: string, @Body() updateMatchDto: MatchDto)  {
  //   return await this.matchesService.update(Number(id), updateMatchDto);
  // }

  // @Delete(':id')
  // async remove(@Param('id') id: string) {
  //   return await this.matchesService.remove(Number(id));
  // }
}
