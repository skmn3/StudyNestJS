import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardStatus } from './board-status.enum';
import { Board } from './board.entity';
import { BoardRepository } from './board.repository';
import { CreateBoardDto } from './dto/create-board.dto';

@Injectable()
export class BoardsService {
    constructor(
        @InjectRepository(BoardRepository)
        private boardRepository: BoardRepository,

    ){}

    async getBoardById(id: number): Promise<Board> {
        const found = await this.boardRepository.findOne(id);

        if(!found) {
            throw new NotFoundException(`Can't find board ${id}`);
        }

        return found;
    }

    createBoard(createBoardDto: CreateBoardDto) : Promise<Board> {
        return this.boardRepository.createBoard(createBoardDto);
    }

    async deleteBoard(id: number) : Promise<void> {
        const result = await this.boardRepository.delete(id);

        if(result.affected === 0) {
            throw  new NotFoundException(`Can't find Board with id ${id}`);
        }
    }

    async updateBoardStatus(id: number, status: BoardStatus) : Promise<Board> {
        const board = await this.getBoardById(id);

        board.status = status;
        await this.boardRepository.save(board);

        return board;
    }
}
