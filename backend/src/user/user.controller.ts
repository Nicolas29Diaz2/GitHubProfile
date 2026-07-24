import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { UserProfileDto } from './dto/user-profile.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':username')
  async getUserProfile(
    @Param('username') username: string,
  ): Promise<UserProfileDto> {
    return this.userService.getUserProfile(username);
  }
}
