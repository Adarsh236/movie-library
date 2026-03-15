import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './config/env.schema'
import { MoviesModule } from './movies/movies.module'
import { TmdbModule } from './tmdb/tmdb.module'
import { CacheModule } from '@nestjs/cache-manager'

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: 60_000,
      max: 500,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => envSchema.parse(config),
    }),
    TmdbModule,
    MoviesModule,
  ],
})
export class AppModule {}
