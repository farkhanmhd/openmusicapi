import { Request, ResponseToolkit } from '@hapi/hapi';
import AuthenticationsService from 'src/services/postgres/AuthenticationsService';
import UsersService from 'src/services/postgres/UsersService';
import TokenManager from 'src/tokenize/TokenManager';
import AuthenticationsValidator from 'src/validator/authentications';
import { IAuthPayload } from 'src/types';

export default class AuthenticationHandler {
  private _authenticationsService: AuthenticationsService;

  private _usersService: UsersService;

  private _tokenManager: typeof TokenManager;

  private _validator: typeof AuthenticationsValidator;

  constructor(
    authenticationsService: AuthenticationsService,
    usersService: UsersService,
    tokenManager: typeof TokenManager,
    validator: typeof AuthenticationsValidator
  ) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationhandler = this.putAuthenticationhandler.bind(this);
    this.deleteAuthenticationHandler =
      this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(request: Request, h: ResponseToolkit) {
    this._validator.validatePostAuthenticationPayload(
      request.payload as IAuthPayload
    );

    const { username, password } = request.payload as IAuthPayload;
    const id = await this._usersService.verifyUserCredential(
      username,
      password
    );
    const accessToken = this._tokenManager.generateAccessToken({ id });
    const refreshToken = this._tokenManager.generateRefeshToken({ id });

    await this._authenticationsService.addRefreshToken(refreshToken);

    const response = h.response({
      status: 'success',
      message: 'Authentication berhasil ditambahkan',
      data: {
        accessToken,
        refreshToken,
      },
    });

    response.code(201);
    return response;
  }

  async putAuthenticationhandler(request: Request) {
    this._validator.validatePutAuthenticationPayload(
      request.payload as { refreshToken: string }
    );

    const { refreshToken } = request.payload as { refreshToken: string };
    await this._authenticationsService.verifyRefreshToken(refreshToken);
    const { id } = this._tokenManager.verifyRefreshToken(refreshToken);
    const accessToken = this._tokenManager.generateAccessToken({ id });

    return {
      status: 'success',
      message: 'Access Token berhasil diperbarui',
      data: { accessToken },
    };
  }

  async deleteAuthenticationHandler(request: Request) {
    this._validator.validateDeleteAuthenticationPayload(
      request.payload as { refreshToken: string }
    );

    const { refreshToken } = request.payload as { refreshToken: string };
    await this._authenticationsService.verifyRefreshToken(refreshToken);
    await this._authenticationsService.deleteRefreshToken(refreshToken);

    return {
      status: 'success',
      message: 'Refresh Token berhasil dihapus',
    };
  }
}
