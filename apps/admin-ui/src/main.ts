import { uiExtensionsConfig } from '@vendure-nx/util-config';
import { compileUiExtensions } from '@vendure/ui-devkit/compiler';
import path from 'path';

compileUiExtensions({
  outputPath: path.join(__dirname, '../../../dist/apps/admin-ui-app'),
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
  devMode: false,
})
  .compile?.()
  .then(() => {
    process.exit(0);
  });
