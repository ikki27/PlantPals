import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlantsModule } from '../plants/plants.module';
import { UsersModule } from '../users/users.module';
import { AssignmentsController } from './assignments.controller';
import { AssignmentsService } from './assignments.service';
import {
  CareAssignment,
  CareAssignmentSchema,
} from './schemas/care-assignment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CareAssignment.name, schema: CareAssignmentSchema },
    ]),
    PlantsModule,
    UsersModule,
  ],
  controllers: [AssignmentsController],
  providers: [AssignmentsService],
})
export class AssignmentsModule {}
