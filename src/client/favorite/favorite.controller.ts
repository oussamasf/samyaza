import {
  Controller,
  Delete,
  Get,
  // Get,
  // Post,
  // Body,
  // Patch,
  Param,
  Post,
  Req,
  UseGuards,
  // Delete,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { AuthGuard } from '@nestjs/passport';
// import { CreateFavoriteDto } from './dto/create-favorite.dto';
// import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import AUTH_GUARD from '../../common/constants/authGuards';

@Controller('client')
@UseGuards(AuthGuard(AUTH_GUARD.ACCESS_TOKEN_CLIENT))
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  // @Post()
  // create(@Body() createFavoriteDto: CreateFavoriteDto) {
  //   return this.favoriteService.create(createFavoriteDto);
  // }

  // @Get()
  // findAll() {
  //   return this.favoriteService.findAll();
  // }

  @Post('movie/:id/add-favorite')
  addMovie(@Param('id') id: string, @Req() req) {
    return this.favoriteService.addToFavoriteMovie(id, req.user);
  }

  @Post('series/:id/add-favorite')
  addSeries(@Param('id') id: string, @Req() req) {
    return this.favoriteService.addToFavoriteSeries(id, req.user);
  }

  @Get('favorite/movie')
  getFavoriteMovieList(@Req() req) {
    return this.favoriteService.getFavoriteMovieList(req.user);
  }

  @Get('favorite/series')
  getFavoriteSeriesList(@Req() req) {
    return this.favoriteService.getFavoriteSeriesList(req.user);
  }

  @Delete('favorite/:id')
  remove(@Param('id') id: string, @Req() req) {
    return this.favoriteService.remove(id, req.user);
  }
}
