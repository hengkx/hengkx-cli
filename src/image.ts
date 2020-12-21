import path from 'path';
import fs from 'fs-extra';
import glob from 'glob';
import sharp from 'sharp';
import inquirer from 'inquirer';
import chalk from 'chalk';

const exts = 'bmp,png,heic,jpg,jpeg';

function image() {
  glob(`*.{${exts},${exts.toUpperCase()}}`, async (_, fileNames) => {
    if (fileNames.length > 0) {
      const { files } = await inquirer.prompt({
        name: 'files',
        message: '选择文件',
        type: 'checkbox',
        choices: fileNames,
        validate: (input) => {
          return input.length > 0 ? true : '请选择文件';
        },
      });

      const { type } = await inquirer.prompt({
        name: 'type',
        message: '类型',
        type: 'list',
        choices: ['改变大小', '重命名'],
        validate: (input) => {
          return input.length > 0 ? true : '请选择大小';
        },
      });
      if (type === '改变大小') {
        const { sizes } = await inquirer.prompt({
          name: 'sizes',
          message: '选择大小',
          type: 'checkbox',
          choices: ['28x28', '108x108', '128x128', '256x256', '512x512', '1080x1920'],
          validate: (input) => {
            return input.length > 0 ? true : '请选择大小';
          },
        });
        await Promise.all(
          files.map((fileName: string) => {
            return sizes.map((size: string) => {
              const [width, height] = size.split('x');
              const ext = path.extname(fileName);
              const name = path.basename(fileName, ext);
              return sharp(fileName)
                .resize(parseInt(width), parseInt(height), { fit: 'fill' })
                .toFile(`${name} ${size}${ext}`);
            });
          }),
        );
      } else {
        files.forEach((fileName: string, index: number) => {
          const ext = path.extname(fileName);
          fs.renameSync(fileName, `${index + 1}${ext}`);
        });
      }
      console.log(chalk.green('图片处理成功'));
    } else {
      console.log(chalk.yellow('没有找到需要处理的文件'));
    }
  });
}

export default image;
