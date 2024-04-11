```json
{
  "name": "@vitejs/vite-monorepo",
  "private": true,
  // es module
  "type": "module",
  "engines": {
    "node": "^18.0.0 || >=20.0.0" // 表示node版本主版本为18，或者大于20的版本
  },
  "homepage": "https://vitejs.dev/",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/vitejs/vite.git"
  },
  "keywords": ["frontend", "hmr", "dev-server", "build-tool", "vite"],
  "scripts": {
    "preinstall": "npx only-allow pnpm", // 只允许通过pnpm安装依赖
    "postinstall": "simple-git-hooks", // 安装完依赖后执行simple-git-hooks命令，simple-git-hooks用于初始化githooks，hook在下方simple-git-hooks字段中
    "format": "prettier --write --cache .", // 格式化
    "lint": "eslint --cache .", // eslint检测
    // 类型检查
    // tsc -p参数指定项目路径 指定script目录 --noEmit不生成文件
    // pnpm -r在工作区的每一个项目中执行此命令 此处运行的是typecheck -- parallel 并发字段
    "typecheck": "tsc -p scripts --noEmit && pnpm -r --parallel run typecheck",
    // npm-run-all2包的命令 run-s 顺序执行命令test-unit -> test-serve -> test-build
    "test": "run-s test-unit test-serve test-build",
    // 使用vitest进行测试
    "test-serve": "vitest run -c vitest.config.e2e.ts",
    "test-build": "VITE_TEST_BUILD=1 vitest run -c vitest.config.e2e.ts",
    "test-unit": "vitest run",
    "test-docs": "pnpm run docs-build",
    "debug-serve": "VITE_DEBUG_SERVE=1 vitest run -c vitest.config.e2e.ts",
    "debug-build": "VITE_TEST_BUILD=1 VITE_PRESERVE_BUILD_ARTIFACTS=1 vitest run -c vitest.config.e2e.ts",
    // docs目录执行run docs命令
    "docs": "pnpm --filter=docs run docs",
    // docs目录执行run docs-build命令
    "docs-build": "pnpm --filter=docs run docs-build",
    // docs目录执行run docs-serve命令
    "docs-serve": "pnpm --filter=docs run docs-serve",
    // 打包命令在每个工作区packages/* 执行run build
    "build": "pnpm -r --filter='./packages/*' run build",
    // ./packages/*下并行执行 run dev
    "dev": "pnpm -r --parallel --filter='./packages/*' run dev",
    // tsx命令 typescript execute 类似 ts-node
    // 用来做git发布打tag用
    "release": "tsx scripts/release.ts",
    // 发布包到npm用
    "ci-publish": "tsx scripts/publishCI.ts",
    // 顺序执行 打包命令 -> 文档生成命令
    "ci-docs": "run-s build docs-build"
  },
  "devDependencies": {
    "@babel/types": "^7.24.0",
    "@eslint-types/typescript-eslint": "^7.2.0",
    "@rollup/plugin-typescript": "^11.1.6",
    "@types/babel__core": "^7.20.5",
    "@types/babel__preset-env": "^7.9.6",
    "@types/convert-source-map": "^2.0.3",
    "@types/cross-spawn": "^6.0.6",
    "@types/debug": "^4.1.12",
    "@types/estree": "^1.0.5",
    "@types/etag": "^1.8.3",
    "@types/fs-extra": "^11.0.4",
    "@types/less": "^3.0.6",
    "@types/micromatch": "^4.0.6",
    "@types/node": "^20.11.30",
    "@types/picomatch": "^2.3.3",
    "@types/sass": "~1.43.1",
    "@types/semver": "^7.5.8",
    "@types/stylus": "^0.48.42",
    "@types/ws": "^8.5.10",
    "@typescript-eslint/eslint-plugin": "^7.4.0",
    "@typescript-eslint/parser": "^7.4.0",
    "@vitejs/release-scripts": "^1.3.1",
    "conventional-changelog-cli": "^4.1.0",
    "eslint": "^8.57.0",
    "eslint-define-config": "^2.1.0",
    "eslint-plugin-i": "^2.29.1",
    "eslint-plugin-n": "^16.6.2",
    "eslint-plugin-regexp": "^2.4.0",
    "execa": "^8.0.1",
    "feed": "^4.2.2",
    "fs-extra": "^11.2.0",
    "lint-staged": "^15.2.2",
    "npm-run-all2": "^6.1.2",
    "picocolors": "^1.0.0",
    "playwright-chromium": "^1.42.1",
    "prettier": "3.2.5",
    "rimraf": "^5.0.5",
    "rollup": "^4.13.0",
    "semver": "^7.6.0",
    "simple-git-hooks": "^2.11.1",
    "tslib": "^2.6.2",
    "tsx": "^4.7.1",
    "typescript": "^5.2.2",
    "unbuild": "^2.0.0",
    "vite": "workspace:*",
    "vitest": "^1.4.0"
  },
  "simple-git-hooks": {
    // 初始化githooks时获取的配置信息
    "pre-commit": "pnpm exec lint-staged --concurrent false"
    // 执行lint-staged命令 --concurrent false 表示串行处理
  },
  "lint-staged": {
    "*": [
      // 所有文件
      "prettier --write --cache --ignore-unknown"
      // 格式化文件
      // --write参数会格式化覆盖文件
      // --cache会进行缓存，当其中内容变化了才会再次格式化
      // --ignore-unknown会忽略未知文件
    ],
    "packages/*/{src,types}/**/*.ts": [
      // 匹配文件流
      "eslint --cache --fix"
      // eslint校验
      // --fix 会尽可能多的自动修复，仅输出未修复的内容
      // --cache 进行缓存，仅对有更改的文件进行校验 开启此选项会提高运行时性能 缓存默认存储在.eslintcache文件中
    ],
    "packages/**/*.d.ts": [
      "eslint --cache --fix"
      // 同上
    ],
    "playground/**/__tests__/**/*.ts": [
      "eslint --cache --fix"
      // 同上
    ]
  },
  // 目前不知道有啥用
  "packageManager": "pnpm@8.15.5",
  "pnpm": {
    "overrides": {
      "vite": "workspace:*"
      // 使用workspace协议 定位到packages内的vite包
    },
    // 用于扩展包信息
    "packageExtensions": {
      "acorn-walk": {
        // 重写依赖版本
        "peerDependencies": {
          "acorn": "*"
        },
        "peerDependenciesMeta": {
          // 表示可选，如果没有安装也不会报错
          "acorn": {
            "optional": true
          }
        }
      }
    },
    // 运行pnpm patch <pkg> 会将软件包提取到一个可以随意编辑的目录，修改完之后
    // 再通过 pnpm patch-commit <path> 会生成一个补丁文件并创建patchedDependencies在package.json里
    "patchedDependencies": {
      "chokidar@3.6.0": "patches/chokidar@3.6.0.patch",
      "sirv@2.0.4": "patches/sirv@2.0.4.patch"
    },
    // 规则
    "peerDependencyRules": {
      // 允许依赖版本，将不会打印未满足版本范围的警告。
      "allowedVersions": {
        "vite": "*"
      },
      // 配置后，以下依赖缺少时不会进行警告
      "ignoreMissing": ["@algolia/client-search", "postcss", "search-insights"]
    }
  },
  // 在线IDE
  "stackblitz": {
    "startCommand": "pnpm --filter='./packages/vite' run dev"
  }
}
```
