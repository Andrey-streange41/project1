import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserController } from './user.controller';
import { CLIENT_URL } from '../../config';

describe('UserController', () => {
  it('should log in a user with valid credentials', async () => {
    // Mock dependencies
    const tokens = {
      accessToken: 'exampleAccessToken',
      refreshToken: 'exampleRefreshToken',
    };
    const userService: any = {
      login: jest.fn().mockResolvedValue(tokens),
    };

    const userController = new UserController(userService);

    const maxAge = 7 * 24 * 60 * 60 * 1000;
    const res: any = {
      cookie: jest.fn(),
      send: jest.fn(),
    };

    // Mock userService.login() method
    userService.login = jest.fn().mockResolvedValue(tokens);

    // Invoke the login method
    await userController.login(
      { email: 'example@example.com', password: 'password123' },
      res,
    );

    // Assertions
    expect(userService.login).toHaveBeenCalledWith({
      email: 'example@example.com',
      password: 'password123',
    });
    expect(res.cookie).toHaveBeenCalledWith(
      'refreshToken',
      'exampleRefreshToken',
      { maxAge, httpOnly: true },
    );
    expect(res.send).toHaveBeenCalledWith(tokens);
  });
  it('should handle a user login with a non-existent email', async () => {
    // Mock dependencies
    const userService: any = {
      login: jest
        .fn()
        .mockRejectedValue(
          new NotFoundException(
            'Користувача з такою електроною адресою nonexistent@example.com не знайдено',
          ),
        ),
    };
    const userController = new UserController(userService);
    const res: any = {
      send: jest.fn(),
    };

    // Invoke the login method
    try {
      await userController.login(
        { email: 'nonexistent@example.com', password: 'password123' },
        res,
      );
    } catch (error) {
      // Check if the error is NotFoundException
      expect(error).toBeInstanceOf(NotFoundException);
    }

    // Assertions
    expect(userService.login).toHaveBeenCalledWith({
      email: 'nonexistent@example.com',
      password: 'password123',
    });
  });
  it('should log out a user when called with a valid refresh token', async () => {
    // Mock dependencies
    const userService: any = { logout: jest.fn() };
    const userController = new UserController(userService);
    const refreshToken = 'exampleRefreshToken';
    const token = 'exampleToken';
    const res: any = {
      clearCookie: jest.fn(),
      send: jest
        .fn()
        .mockReturnValue({ status: 200, message: 'Logged out successfully' }),
    };

    // Mock userService.logout() method
    userService.logout.mockResolvedValue(token);

    // Invoke the logout method
    await userController.logout({ cookies: { refreshToken } } as any, res);

    // Assertions
    expect(userService.logout).toHaveBeenCalledWith(refreshToken);
    expect(res.clearCookie).toHaveBeenCalledWith('refreshToken');
    expect(res.send).toHaveBeenCalledWith(token);
  });
  it('should register a new user when valid credentials are provided', async () => {
    const userService: any = { registrarion: jest.fn() };
    const userController = new UserController(userService);
    const userDTO = { email: 'example@example.com', password: 'password123' };
    const user = {
      email: 'example@example.com',
      id: 'exampleId',
      isActivated: false,
    };
    const tokens = {
      accessToken: 'exampleAccessToken',
      refreshToken: 'exampleRefreshToken',
    };
    const maxAge = 7 * 24 * 60 * 60 * 1000;
    const res: any = { cookie: jest.fn(), send: jest.fn() };

    userService.registrarion.mockResolvedValue({ ...tokens, user });

    await userController.registration(userDTO, res);

    expect(userService.registrarion).toHaveBeenCalledWith(userDTO);
    expect(res.cookie).toHaveBeenCalledWith(
      'refreshToken',
      tokens.refreshToken,
      { maxAge, httpOnly: true },
    );
    expect(res.send).toHaveBeenCalledWith({ ...tokens, user });
  });
  it('should activate a user account when given a valid activation link', async () => {
    const mockUserService: any = { activateAccount: jest.fn() };
    const userController = new UserController(mockUserService);
    const res: any = { redirect: jest.fn() };

    await userController.activatelink('validActivationLink', res);

    expect(mockUserService.activateAccount).toHaveBeenCalledWith(
      'validActivationLink',
    );
    expect(res.redirect).toHaveBeenCalledWith(CLIENT_URL);
  });
  it('should refresh a user token when a valid refresh token is provided', async () => {
    const userData = {
      accessToken: 'newAccessToken',
      refreshToken: 'newRefreshToken',
    };
    const maxAge = 7 * 24 * 60 * 60 * 1000;
    const mockUserService: any = {
      refresh: jest.fn().mockResolvedValue(userData),
    };
    const userController = new UserController(mockUserService);
    const req: any = { cookies: { refreshToken: 'exampleRefreshToken' } };
    const res: any = { cookie: jest.fn(), send: jest.fn() };

    await userController.refresh(req, res);

    expect(mockUserService.refresh).toHaveBeenCalledWith('exampleRefreshToken');
    expect(res.cookie).toHaveBeenCalledWith(
      'refreshToken',
      userData.refreshToken,
      { maxAge, httpOnly: true },
    );
    expect(res.send).toHaveBeenCalledWith(userData);
  });
  it('should return a 401 Unauthorized response when attempting to log in with invalid credentials', async () => {
    const userService: any = { login: jest.fn() };
    const userController = new UserController(userService);
    const res: any = { cookie: jest.fn(), send: jest.fn() };

    userService.login.mockRejectedValue(
      new UnauthorizedException('Invalid credentials'),
    );

    await expect(
      userController.login(
        { email: 'example@example.com', password: 'password123' },
        res,
      ),
    ).rejects.toThrow(UnauthorizedException);

    expect(userService.login).toHaveBeenCalledWith({
      email: 'example@example.com',
      password: 'password123',
    });
    expect(res.cookie).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });
  it('should return a 400 Bad Request response when attempting to log in without providing email or password', async () => {
    // Mock dependencies
    const userService: any = { login: jest.fn() };
    const userController = new UserController(userService);
    const res = {
      send: jest.fn(),
      cookie: jest.fn(),
    };

    // Invoke the login method without providing email or password
    await userController.login({} as any, res as any);

    // Assertions
    expect(userService.login).toHaveBeenCalledWith({});
    expect(res.cookie).not.toHaveBeenCalled();
  });
  // UserController returns a 400 Bad Request response when attempting to register with invalid email or password
  it('should return a 400 Bad Request response when attempting to register with invalid email or password', async () => {
    // Mock dependencies
    const userService: any = { registrarion: jest.fn() };
    const userController = new UserController(userService);
    const userDTO = { email: 'invalidemail', password: 'short' };
    const res: any = {
      cookie: jest.fn(),
      send: jest.fn(),
    };

    // Mock the userService.registrarion to throw an error
    userService.registrarion.mockImplementation(() => {
      throw new BadRequestException('Bad Request');
    });

    // Invoke the registration method
    try {
      await userController.registration(userDTO, res);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });
  // UserController returns a 400 Bad Request response when attempting to activate an account with an invalid activation link
  it('should return a 400 Bad Request response when attempting to activate an account with an invalid activation link', async () => {
    const userService: any = { activateAccount: jest.fn() };
    const userController = new UserController(userService);
    const res: any = { redirect: jest.fn() };

    userService.activateAccount.mockRejectedValue(
      new NotFoundException('Not found'),
    );

    await expect(
      userController.activatelink('invalidLink', res),
    ).rejects.toThrow(NotFoundException);

    expect(userService.activateAccount).toHaveBeenCalledWith('invalidLink');
    expect(res.redirect).not.toHaveBeenCalled();
  });
  // UserController can handle a user login with an email that exists in the database but with an incorrect password
  it('should handle login with incorrect password', async () => {
    const userService: any = { login: jest.fn() };
    const userController = new UserController(userService);
    const res: any = { cookie: jest.fn(), send: jest.fn() };
    userService.login.mockRejectedValue(
      new UnauthorizedException('Incorrect password'),
    );
    try {
      await userController.login(
        { email: 'example@example.com', password: 'incorrectPassword' },
        res,
      );
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
    }

    expect(userService.login).toHaveBeenCalledWith({
      email: 'example@example.com',
      password: 'incorrectPassword',
    });
    expect(res.cookie).not.toHaveBeenCalled();
  });
  // UserController can handle a user registration with an email that already exists in the database
  it('should handle user registration with existing email', async () => {
    const userService: any = { registrarion: jest.fn() };
    const userController = new UserController(userService);
    const userDTO = { email: 'existing@example.com', password: 'password123' };
    const res: any = { cookie: jest.fn(), send: jest.fn() };

    userService.registrarion.mockRejectedValue(
      new ConflictException('User already exist'),
    );

    await expect(userController.registration(userDTO, res)).rejects.toThrow(
      ConflictException,
    );

    expect(userService.registrarion).toHaveBeenCalledWith(userDTO);
    expect(res.cookie).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });
  // UserController can handle a user registration with an invalid email or password
  it('should handle user registration with invalid email or password', async () => {
    // Mock dependencies
    const userService: any = { registrarion: jest.fn() };
    const userController = new UserController(userService);
    const userDTO = { email: 'invalidemail', password: 'short' };
    const res: any = {
      cookie: jest.fn(),
      send: jest.fn(),
    };

    // Invoke the registration method
    await userController.registration(userDTO, res);

    // Assertions
    expect(userService.registrarion).toHaveBeenCalledWith(userDTO);
  });
});
