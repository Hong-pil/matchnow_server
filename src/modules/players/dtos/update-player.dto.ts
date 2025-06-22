import { PickType, PartialType } from '@nestjs/swagger';

import { generateResponse } from '@/common/utils/response.util';

import { Player } from '../schemas/player.schema';

export class UpdatePlayerDto extends PartialType(
  PickType(Player, ['name', 'nameEng', 'position', 'healthStatus', 'photos'] as const),
) {}
export class UpdatePlayerResponse extends generateResponse(UpdatePlayerDto) {}
