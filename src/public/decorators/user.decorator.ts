import { ExecutionContext, createParamDecorator } from '@nestjs/common';

interface IUser {
  id: number;
}

/**
 * 유저 데이터 데코레이터
 * @description 인가 후 요청 헤더에 있는 유저 메타 데이터 정보 추출
 */

export const UserData = createParamDecorator(
  <TKey extends keyof IUser>(
    key: TKey | undefined,
    ctx: ExecutionContext,
  ): IUser[TKey] | IUser => {
    const request = ctx.switchToHttp().getRequest();
    const user: IUser = request.user;

    return key ? user[key] : user;
  },
);
