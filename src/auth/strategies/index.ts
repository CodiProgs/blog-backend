import { GoogleStrategy } from './google.strategy'
import { JwtStrategy } from './jwt.strategy'

export * from './google.strategy'
export * from './jwt.strategy'

export const STRATEGIES = [GoogleStrategy, JwtStrategy]
