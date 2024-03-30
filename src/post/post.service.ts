import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/public/prisma/prisma.service';
import { CreatePostDto } from './dto/create.post.dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async createPost(createPostDto: CreatePostDto) {
    const { userId, title, content } = createPostDto;
    await this.prisma.post.create({
      data: {
        userId,
        title,
        content,
      },
    });
  }
}
