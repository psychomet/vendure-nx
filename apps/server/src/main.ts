import { config, uiExtensionsConfig } from '@vendure-nx/util-config';
import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
import {
  bootstrap,
  JobQueueService,
  LanguageCode,
  mergeConfig,
  runMigrations,
} from '@vendure/core';
import * as path from 'path';

const ADMIN_UI_DEV_MODE = !!process.env.ADMIN_UI_DEV_MODE;

const mergedConfig = mergeConfig(config, {
  dbConnectionOptions: {
    migrations: [path.join(__dirname, '../../migrations/*.js')],
  },
  plugins: [
    ...config.plugins,
    AdminUiPlugin.init({
      port: +process.env.API_INTERNAL_PORT + 3,
      route: 'admin',
      adminUiConfig: {
        apiHost: ADMIN_UI_DEV_MODE
          ? process.env.API_PUBLIC_URL
          : process.env.API_PUBLIC_URL + '/admin-api',
        apiPort: ADMIN_UI_DEV_MODE && +(process.env.API_PUBLIC_PORT as string),
        tokenMethod: 'bearer',
        defaultLanguage: LanguageCode.fa,
        availableLanguages: [LanguageCode.en, LanguageCode.fa],
      },

      app: ADMIN_UI_DEV_MODE
        ? // eslint-disable-next-line @typescript-eslint/no-var-requires
          require('@vendure/ui-devkit/compiler').compileUiExtensions({
            outputPath: path.join(__dirname, '../__temp-admin-ui'),
            extensions: uiExtensionsConfig,
            devMode: true,
            command: 'npm',
          })
        : {
            path: path.join(process.cwd(), 'dist/apps/admin-ui-app/dist'),
          },
    }),
  ],
});

runMigrations(mergedConfig)
  .then(() => bootstrap(mergedConfig))
  .then((app) => {
    if (process.env.RUN_JOB_QUEUE === '1') {
      app.get(JobQueueService).start();
    }
  })
  .catch((err: any) => {
    // tslint:disable-next-line:no-console
    console.log(err);
    process.exit(1);
  });
