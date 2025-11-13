const path = require('path');
const fs = require('fs');

function readFileWithExtAutoComplete(basePath, exts = ['.tsx', '.ts', '.js', '.jsx']) {
  for (const ext of exts) {
    try {
      const filePath = basePath + ext;
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        return fs.readFileSync(filePath, 'utf8');
      }
      const indexFilePath = basePath + '/index' + ext;
      if (fs.existsSync(indexFilePath) && fs.statSync(indexFilePath).isFile()) {
        return fs.readFileSync(indexFilePath, 'utf8');
      }
    } catch (e) {}
  }
  throw new Error(
    `No file found with extensions ${exts.join(
      ', ',
    )} for base path: ${basePath} or its index files`,
  );
}

const navigateMap = {};
function collectNavigates(moduleId, completePath) {
  if (navigateMap[moduleId]) return navigateMap[moduleId];

  const fileContent = readFileWithExtAutoComplete(completePath);

  const matchedIterator = fileContent.matchAll(/history[\.](?:push|replace)\(['"`](.*)['"`]\)/g);
  const result = [...matchedIterator];

  if (result?.length > 0) {
    const navigates = result
      .map((r) => r[1])
      .reduce((currentNavigate, currentTarget) => {
        currentNavigate[currentTarget] = currentTarget;
        return currentNavigate;
      }, {});

    navigateMap[moduleId] = navigates;
    return navigates;
  }
}

function transformLazyRoute(input) {
  const componentMatcher = /component:\s*['"`]([.0-9A-Za-z\\/]*)['"`]/g;
  const lazyRouter = input.replace(componentMatcher, (match, compPath) => {
    const completeComponentPath = path.resolve(
      __dirname,
      '../../../pages/',
      compPath.trim().replace(/^['"`]+|['"`]+$/g, ''),
    );

    const collectedNavigates = collectNavigates(completeComponentPath, completeComponentPath);
    const collectedNavigateString = collectedNavigates
      ? `
      navigates: ${JSON.stringify(collectedNavigates)},\n
    `
      : '';

    return `${collectedNavigateString}component: ()=>import("${completeComponentPath}"),\ncomponentPath:"${completeComponentPath}" `;
  });

  console.log('\x1b[32m%s\x1b[0m', '✔ 动态路由组件处理完成');

  return lazyRouter;
}

function transformIconRoute(input) {
  const iconMatcher = /icon:\s*['"`]([.0-9A-Za-z\\/]*)['"`]/g;
  const iconImportList = [];
  const iconStr = input.replace(iconMatcher, (match, iconName) => {
    const formattedIconName = iconName.trim().replace(/^['"`]+|['"`]+$/g, '');
    iconImportList.push(formattedIconName);
    return `icon: "${formattedIconName}"`;
  });

  return `
  import React from 'react';
  import {${iconImportList.join(',')}} from '@ant-design/icons';
  ${iconStr}
  export const routerIconMap = {${iconImportList.join(',')}}
  `;
}

const stripComments = (code) => {
  return code
    .replace(/\/\/.*(?=[\n\r])/g, '')                   // 去除单行注释
    .replace(/\/\*[\s\S]*?\*\//g, '');                  // 去除多行注释
};


module.exports = function (content) {
  const completeComponentPath = this.resourcePath;
  const noCommentContent = stripComments(content);
  console.log(
    `📦 正在处理模块懒加载: ${completeComponentPath.slice(
      completeComponentPath.lastIndexOf('/') + 1,
    )}`,
  );
  return transformIconRoute(transformLazyRoute(noCommentContent));
};
