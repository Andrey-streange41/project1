import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthUserDTO } from './user.dto';
import { UserAuthPipe } from './user.pipe';
import { Request, Response } from 'express';
import { CLIENT_URL } from '../../config';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {
    this.userService = userService;
  }
  @Post('/login')
  @ApiBody({ type: AuthUserDTO })
  @ApiResponse({
    status: 200,
    description: 'User has been successfully logged in.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @UsePipes(new UserAuthPipe())
  async login(
    @Body() user: AuthUserDTO,
    @Res() res: Response,
  ): Promise<
    | UnauthorizedException
    | Response<{ accessToken: string; refreshToken: string }>
  > {
    const tokens = await this.userService.login(user);
    if (!tokens) return null;
    const maxAge = 7 * 24 * 60 * 60 * 1000;
    res.cookie('refreshToken', tokens?.refreshToken, {
      maxAge,
      httpOnly: true,
    });
    return res.send(tokens);
  }

  @Post('/logout')
  @ApiResponse({
    status: 200,
    description: 'User has been successfully logged out.',
  })
  async logout(@Req() req: Request, @Res() res: Response) {
    const { refreshToken } = req.cookies;
    const token = await this.userService.logout(refreshToken as string);
    res.clearCookie('refreshToken');
    return res.send(token);
  }

  @Post('/registration')
  @ApiBody({ type: AuthUserDTO })
  @ApiResponse({
    status: 201,
    description: 'User has been successfully registered.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @UsePipes(new UserAuthPipe())
  async registration(@Body() userDTO: AuthUserDTO, @Res() res: Response) {
    const user = await this.userService.registrarion(userDTO);
    if (!user) return null;
    const maxAge = 7 * 24 * 60 * 60 * 1000;
    res.cookie('refreshToken', user.refreshToken, { maxAge, httpOnly: true });
    return res.send(user);
  }

  @Get('/activate/:link')
  @ApiResponse({
    status: 200,
    description: 'User account has been successfully activated.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async activatelink(@Param('link') link: string, @Res() res: Response) {
    await this.userService.activateAccount(link);
    return res.redirect(CLIENT_URL);
  }

  @Post('/refresh')
  @ApiResponse({
    status: 200,
    description: 'User token has been successfully refreshed.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async refresh(@Req() req: Request, @Res() res: Response) {
    const { refreshToken } = req.cookies;
    const userData = await this.userService.refresh(refreshToken);
    if (!userData) return null;
    const maxAge = 7 * 24 * 60 * 60 * 1000;
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge,
      httpOnly: true,
    });
    return res.send(userData);
  }
}
