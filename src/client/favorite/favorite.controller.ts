import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { AuthGuard } from '@nestjs/passport';

import AUTH_GUARD from '../../common/constants/authGuards';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';

@Controller('client')
@UseGuards(AuthGuard(AUTH_GUARD.ACCESS_TOKEN_CLIENT))
@ApiTags('Client/favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  // Add Movie to Favorites endpoint
  @ApiParam({ name: 'id', description: 'Movie ID' })
  @ApiBearerAuth()
  @Post('movie/:id/add-favorite')
  addMovie(@Param('id') id: string, @Req() req) {
    return this.favoriteService.addToFavoriteMovie(id, req.user);
  }

  // Add Series to Favorites endpoint
  @ApiParam({ name: 'id', description: 'Series ID' })
  @ApiBearerAuth()
  @Post('series/:id/add-favorite')
  addSeries(@Param('id') id: string, @Req() req) {
    return this.favoriteService.addToFavoriteSeries(id, req.user);
  }

  // Get Favorite Movie List endpoint
  @ApiBearerAuth()
  @Get('favorite/movie')
  getFavoriteMovieList(@Req() req) {
    return this.favoriteService.getFavoriteMovieList(req.user);
  }

  // Get Favorite Series List endpoint
  @ApiBearerAuth()
  @Get('favorite/series')
  getFavoriteSeriesList(@Req() req) {
    return this.favoriteService.getFavoriteSeriesList(req.user);
  }

  // Remove Favorite endpoint
  @ApiParam({ name: 'id', description: 'Favorite ID' })
  @ApiBearerAuth()
  @Delete('favorite/:id')
  remove(@Param('id') id: string, @Req() req) {
    return this.favoriteService.remove(id, req.user);
  }
}
