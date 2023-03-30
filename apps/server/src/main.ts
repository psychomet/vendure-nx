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
        apiHost: process.env.API_PUBLIC_URL,
        apiPort: +(process.env.API_PUBLIC_PORT as string),
        tokenMethod: 'bearer',
        defaultLanguage: LanguageCode.fa,
        availableLanguages: [LanguageCode.en, LanguageCode.fa],
      },

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      app: require('@vendure/ui-devkit/compiler').compileUiExtensions({
        outputPath: path.join(__dirname, '../__temp-admin-ui'),
        extensions: [
          {
            translations: {
              fa: path.join(process.cwd(), 'static/translations/fa.json'),
            },
          },
          {
            sassVariableOverrides: path.join(
              process.cwd(),
              'static/my-variables.scss'
            ),
          },
          {
            globalStyles: path.join(process.cwd(), 'static/my-theme.scss'),
          },
          ...uiExtensionsConfig,
        ],
        devMode: ADMIN_UI_DEV_MODE,
        command: 'npm',
      }),
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
