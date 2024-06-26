```json
{
  "name": "vite",
  "version": "5.2.7",
  "type": "module",
  "license": "MIT",
  "author": "Evan You",
  "description": "Native-ESM powered web dev build tool",
  // 描述bin命令文件路径
  "bin": {
    "vite": "bin/vite.js"
  },
  "keywords": [
    "frontend",
    "framework",
    "hmr",
    "dev-server",
    "build-tool",
    "vite"
  ],
  "main": "./dist/node/index.js",
  "types": "./dist/node/index.d.ts",
  // 指定模块导出
  "exports": {
    ".": {
      "import": {
        "types": "./dist/node/index.d.ts",
        "default": "./dist/node/index.js"
      },
      "require": {
        "types": "./index.d.cts",
        "default": "./index.cjs"
      }
    },
    "./client": {
      "types": "./client.d.ts"
    },
    "./runtime": {
      "types": "./dist/node/runtime.d.ts",
      "import": "./dist/node/runtime.js"
    },
    "./dist/client/*": "./dist/client/*",
    "./types/*": {
      "types": "./types/*"
    },
    "./package.json": "./package.json"
  },
  // 用于ts识别
  "typesVersions": {
    "*": {
      "runtime": ["dist/node/runtime.d.ts"]
    }
  },
  // 指定使用时暴露的文件
  "files": ["bin", "dist", "client.d.ts", "index.cjs", "index.d.cts", "types"],
  // 依赖环境
  "engines": {
    "node": "^18.0.0 || >=20.0.0"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/vitejs/vite.git",
    "directory": "packages/vite"
  },
  "bugs": {
    "url": "https://github.com/vitejs/vite/issues"
  },
  "homepage": "https://vitejs.dev",
  "funding": "https://github.com/vitejs/vite?sponsor=1",
  "scripts": {
    // rimraf命令来源rimraf包用于删除操作
    // 删除dist文件夹后打包bundle
    "dev": "rimraf dist && pnpm run build-bundle -w",
    // 删除dist文件夹后顺序执行build-bundle和build-types命令
    "build": "rimraf dist && run-s build-bundle build-types",
    // rollup打包命令，指定配置文件 rollup.config.ts --configPlugin参数typescript可以允许使用ts来编写配置文件
    "build-bundle": "rollup --config rollup.config.ts --configPlugin typescript",
    // run-s顺序执行build-types-temp，build-types-roll，build-types-check 三个命令
    "build-types": "run-s build-types-temp build-types-roll build-types-check",
    // 仅创建声明文件 导出目录到temp文件夹 -p 指定项目路径为 src/node文件夹
    "build-types-temp": "tsc --emitDeclarationOnly --outDir temp -p src/node",
    // 使用rollup打包命令 指定配置rollup.dts.config.ts 使用typescript编写配置，打包完毕删除temp文件夹
    "build-types-roll": "rollup --config rollup.dts.config.ts --configPlugin typescript && rimraf temp",
    // 执行tsc编译 指定项目配置文件tsconfig.check.json
    "build-types-check": "tsc --project tsconfig.check.json",
    // 进行类型检查，tsc编译命令并不生成文件
    "typecheck": "tsc --noEmit",
    // 执行eslint检测命令，--cache进行缓存, --ext指定文件后缀，src/**指定检测路径
    "lint": "eslint --cache --ext .ts src/**",
    // 格式化替换文件内容，使用缓存，解析器使用typescript，匹配为src/**/*.ts文件
    "format": "prettier --write --cache --parser typescript \"src/**/*.ts\"",
    // 预发布处理 执行build打包命令
    "prepublishOnly": "npm run build"
  },
  "//": "READ CONTRIBUTING.md to understand what to put under deps vs. devDeps!",
  "dependencies": {
    "esbuild": "^0.20.1",
    "postcss": "^8.4.38",
    "rollup": "^4.13.0"
  },
  "optionalDependencies": {
    "fsevents": "~2.3.3"
  },
  "devDependencies": {
    "@ampproject/remapping": "^2.3.0",
    "@babel/parser": "^7.24.1",
    "@jridgewell/trace-mapping": "^0.3.25",
    "@polka/compression": "^1.0.0-next.25",
    "@rollup/plugin-alias": "^5.1.0",
    "@rollup/plugin-commonjs": "^25.0.7",
    "@rollup/plugin-dynamic-import-vars": "^2.1.2",
    "@rollup/plugin-json": "^6.1.0",
    "@rollup/plugin-node-resolve": "15.2.3",
    "@rollup/plugin-typescript": "^11.1.6",
    "@rollup/pluginutils": "^5.1.0",
    "@types/escape-html": "^1.0.4",
    "@types/pnpapi": "^0.0.5",
    "acorn": "^8.11.3",
    "acorn-walk": "^8.3.2",
    "artichokie": "^0.2.0",
    "cac": "^6.7.14",
    "chokidar": "^3.6.0",
    "connect": "^3.7.0",
    "convert-source-map": "^2.0.0",
    "cors": "^2.8.5",
    "cross-spawn": "^7.0.3",
    "debug": "^4.3.4",
    "dep-types": "link:./src/types",
    "dotenv": "^16.4.5",
    "dotenv-expand": "^11.0.6",
    "es-module-lexer": "^1.5.0",
    "escape-html": "^1.0.3",
    "estree-walker": "^3.0.3",
    "etag": "^1.8.1",
    "fast-glob": "^3.3.2",
    "http-proxy": "^1.18.1",
    "launch-editor-middleware": "^2.6.1",
    "lightningcss": "^1.24.1",
    "magic-string": "^0.30.8",
    "micromatch": "^4.0.5",
    "mlly": "^1.6.1",
    "mrmime": "^2.0.0",
    "open": "^8.4.2",
    "parse5": "^7.1.2",
    "pathe": "^1.1.2",
    "periscopic": "^4.0.2",
    "picocolors": "^1.0.0",
    "picomatch": "^2.3.1",
    "postcss-import": "^16.1.0",
    "postcss-load-config": "^4.0.2",
    "postcss-modules": "^6.0.0",
    "resolve.exports": "^2.0.2",
    "rollup-plugin-dts": "^6.1.0",
    "rollup-plugin-esbuild": "^6.1.1",
    "rollup-plugin-license": "^3.3.1",
    "sirv": "^2.0.4",
    "source-map-support": "^0.5.21",
    "strip-ansi": "^7.1.0",
    "strip-literal": "^2.0.0",
    "tsconfck": "^3.0.3",
    "tslib": "^2.6.2",
    "types": "link:./types",
    "ufo": "^1.5.3",
    "ws": "^8.16.0"
  },
  "peerDependencies": {
    "@types/node": "^18.0.0 || >=20.0.0",
    "less": "*",
    "lightningcss": "^1.21.0",
    "sass": "*",
    "stylus": "*",
    "sugarss": "*",
    "terser": "^5.4.0"
  },
  // 元数据，表示可选的，不会报错
  "peerDependenciesMeta": {
    "@types/node": {
      "optional": true
    },
    "sass": {
      "optional": true
    },
    "stylus": {
      "optional": true
    },
    "less": {
      "optional": true
    },
    "sugarss": {
      "optional": true
    },
    "lightningcss": {
      "optional": true
    },
    "terser": {
      "optional": true
    }
  }
}
```
