import { ErrorCode } from '../../../global/exception/errorCode';
import { CustomException } from '../../../global/exception/customException';
import { HttpStatus } from '@nestjs/common';

export class StudentIDAlreadyExistsException extends CustomException {
  constructor() {
    super(
      ErrorCode.USER_STUDENTID_ALREADY_EXIST,
      '이미 존재하는 학번이 있습니다!',
      HttpStatus.CONFLICT,
    );
  }
}
