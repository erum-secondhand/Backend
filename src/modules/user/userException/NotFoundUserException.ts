import { HttpStatus } from '@nestjs/common';
import { CustomException } from 'src/global/exception/customException';
import { ErrorCode } from 'src/global/exception/errorCode';

export class NotFoundUserException extends CustomException {
  constructor() {
    super(
      ErrorCode.USER_NOT_FOUND,
      '사용자를 찾을 수 없습니다!',
      HttpStatus.CONFLICT,
    );
  }
}
