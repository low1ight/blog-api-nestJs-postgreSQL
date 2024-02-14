import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('QuizGame')
export class QuizGameEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstPlayerId: number;

  @Column()
  secondPlayerId: number | null;

  @Column()
  status: string;

  @Column()
  pairCreatedDate: Date;

  @Column()
  startGameDate: Date | null;

  @Column()
  finishGameDate: Date | null;
}
