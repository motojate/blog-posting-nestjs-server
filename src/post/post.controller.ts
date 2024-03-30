import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UserData } from 'src/public/decorators/user.decorator';
import { JwtAuthGuard } from 'src/public/guards/jwt-auth.guard';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  /**
   * 게시글 작성 API
   * @param userId 인가된 유저의 id
   * @param createPostDto title 및 content
   * @returns 만들어진 게시글 정보
   */
  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createPost(
    @UserData('id') userId: number,
    @Body() createPostDto: Omit<CreatePostDto, 'userId'>,
  ) {
    const { title, content } = createPostDto;
    const createPostDtoWithUserId = CreatePostDto.create({
      title,
      content,
      userId,
    });
    return this.postService.createPost(createPostDtoWithUserId);
  }

  /**
   * 게시글 전체 보기 API
   * @returns 전체 게시글 리스트
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllPosts() {
    return this.postService.getAllPosts();
  }

  /**
   * 게시글 상세 보기 API
   * @param id 게시글 id
   * @returns 선택된 게시글
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getPostDetail(@Param('id') id: string) {
    return this.postService.getPost(+id);
  }

  /**
   * 게시글 수정 API
   * @param userId 인가된 유저의 id
   * @param postId 게시글 id
   * @param dto 수정할 컨텐츠 내용
   * @returns 업데이트된 게시글 정보
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updatePost(
    @UserData('id') userId: number,
    @Param('id') postId: string,
    @Body() dto: { content: string },
  ) {
    const updatePostDto = UpdatePostDto.create({
      userId,
      postId: +postId,
      content: dto.content,
    });

    return this.postService.updatePost(updatePostDto);
  }

  /**
   * 게시글 삭제 API
   * @param userId 인가된 유저의 id
   * @param postId 게시글 id
   * @returns 삭제된 게시글 정보
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deletePost(
    @UserData('id') userId: number,
    @Param('id') postId: string,
  ) {
    return this.postService.deletePost(userId, +postId);
  }
}
