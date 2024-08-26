import { HttpStatus } from '@nestjs/common';
import { CustomException } from 'src/global/exception/customException';
import { ErrorCode } from 'src/global/exception/errorCode';

export class LoginInvalidPasswordException extends CustomException {
  constructor() {
    super(
      ErrorCode.USER_INVALID_PASSWORD,
      '비밀번호가 일치하지 않습니다! 다시 로그인을 해주세요.',
      HttpStatus.UNAUTHORIZED,
    );
  }
}
