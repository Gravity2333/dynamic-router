module.exports = function (content) {
    return content;
  };
  
  function _deepClone(target) {
    // 定义一个变量
    let result;
    // 如果当前需要深拷贝的是一个对象的话
    if (typeof target === 'object') {
      // 如果是一个数组的话
      if (Array.isArray(target)) {
        result = []; // 将result赋值为一个数组，并且执行遍历
        for (let i in target) {
          // 递归克隆数组中的每一项
          result.push(_deepClone(target[i]));
        }
        // 判断如果当前的值是null的话；直接赋值为null
      } else if (target === null) {
        result = null;
        // 判断如果当前的值是一个RegExp对象的话，直接赋值
      } else if (target.constructor === RegExp) {
        result = target;
      } else {
        // 否则是普通对象，直接for in循环，递归赋值对象的所有值
        result = {};
        for (let i in target) {
          result[i] = _deepClone(target[i]);
        }
      }
      // 如果不是对象的话，就是基本数据类型，那么直接赋值
    } else {
      result = target;
    }
    // 返回最终结果
    return result;
  }
  
  /** 遍历 router config */
  function traverseRoute(routerConfig, callback) {
    {
      routerConfig.map((route) => {
        callback(route);
        if (route.routes && route.routes?.length > 0) {
          traverseRoute(route.routes, callback);
        }
      });
    }
  }
  
  function generateDisplayLayerAndModuleMap(routerConfig, routerIconMap = {}) {
    const displayLayer = _deepClone(routerConfig);
    const moduleMap = {};
    traverseRoute(displayLayer, (routeConfig) => {
      const moduleId = routeConfig?.moduleId || routeConfig.path;
      const componentPath = routeConfig.componentPath || '';
      if (componentPath.match(/\/layouts\/PageLayout/)) {
        if (!moduleMap['PAGE_LAYOUT_KEY']) {
          moduleMap['PAGE_LAYOUT_KEY'] = routeConfig.component;
        }
        routeConfig.moduleId = 'PAGE_LAYOUT_KEY';
        delete routeConfig.component;
        delete routeConfig.componentPath;
      } else if (moduleId && routeConfig.component) {
        moduleMap[moduleId] = routeConfig.component;
        routeConfig.moduleId = moduleId;
        delete routeConfig.component;
      }
    });
  
    return {
      routerConfig,
      routerConfigDisplay: displayLayer,
      moduleMap,
      routerIconMap,
    };
  }
  
  /** 生成展示层对象 =>  */
  module.exports.pitch = (remainingRequest) => {
    console.log(`📦 ➔ 📦 ➔📦 正在创建路由和组件层分割器`);
  
    return `
      import routerConfig,{routerIconMap} from "${remainingRequest}";
      ${traverseRoute}
      ${_deepClone}
      export default (${generateDisplayLayerAndModuleMap})(routerConfig,routerIconMap)
    `;
  };
  