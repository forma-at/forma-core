export enum proficiency {
  elementary,
  intermediate,
  professional,
  expert,
}

export type subject = { code: string, proficiency: proficiency };

export type language = { code: string, proficiency: proficiency };
