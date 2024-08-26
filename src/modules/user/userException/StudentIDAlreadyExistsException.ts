import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from 'src/global/exception/errorCode';
import { CustomException } from 'src/global/exception/customException';

export class StudentIDAlreadyExistsException extends CustomException {
  constructor() {
    super(
      ErrorCode.USER_STUDENTID_ALREADY_EXIST,
      '이미 존재하는 학번이 있습니다!',
      HttpStatus.CONFLICT,
    );
  }
}
