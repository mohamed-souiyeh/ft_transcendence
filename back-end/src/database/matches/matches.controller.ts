import { MatchesService } from './matches.service';
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {
  }

  @Get()
  findAll() {
    return this.matchesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matchesService.findOne(Number(id));
  }

  // @Post()
  // create(@Body() createMatchDto: MatchDto) {
  //   return this.matchesService.create(createMatchDto);
  // }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateMatchDto: MatchDto) {
    return this.matchesService.update(Number(id), updateMatchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.matchesService.remove(Number(id));
  }
}
