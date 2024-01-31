var csInterface = new CSInterface();

var userDataPath = csInterface.getSystemPath(SystemPath.USER_DATA) + "/";
var extPath = csInterface.getSystemPath(SystemPath.EXTENSION) + "/jsx/";

function alert(text) {
  csInterface.evalScript('alert("' + text + '")');
}

//无序数组比较
function arraysEqualUnordered(arr1, arr2) {
  const sortedArr1 = arr1.slice().sort();
  const sortedArr2 = arr2.slice().sort();
  return JSON.stringify(sortedArr1) === JSON.stringify(sortedArr2);
}

//合并数组并去重
function mergeArraysAndRemoveDuplicates(arr1, arr2) {
  // 合并两个数组并转为 Set 去重
  const mergedSet = new Set([...arr1, ...arr2]);

  // 将 Set 转回数组
  const mergedArray = Array.from(mergedSet);

  return mergedArray;
}

//数组2里面有的数组1都有
function isArrayContained(array1, array2) {
  // 使用 every 方法检查数组2的每个元素是否都在数组1中存在
  return array2.every((item) => array1.includes(item));
}

function containsSubstringIgnoreCase(mainString, substring) {
  // 将两个字符串转换为小写（或大写）再进行包含性检查
  return mainString.toLowerCase().includes(substring.toLowerCase());
}

//读取系统字体
function readSystemFont(callBack) {
  csInterface.evalScript("getFontsJson()", (result) => {
    let fontJsonList = JSON.parse(result);
    callBack(fontJsonList);
  });
}

// 读取用户配置
function readUserConfig(fontList) {
  let result = window.cep.fs.readFile(
    userDataPath + "fontManage/fontManage.json"
  );
  if (0 != result.err) {
    return;
  }
  let fontListConfig = JSON.parse(result.data);
  if (fontListConfig) {
    for (let i = 0; i < fontList.length; i++) {
      for (let j = 0; j < fontListConfig.length; j++) {
        let fontObjNew = fontListConfig[j];
        if (fontObjNew.name !== fontList[i].name) {
          continue;
        }
        fontList[i].aliasNmae = fontObjNew.aliasNmae;
        fontList[i].tags = fontObjNew.tags;
        fontList[i]._visiable = fontObjNew._visiable;
      }
    }
  }
}

//读取标签
function readFontTags(fontList, tagList, tagObj) {
  let tags = [];
  for (let i = 0; i < fontList.length; i++) {
    let fonObj = fontList[i];

    fonObj.tags.forEach((tag) => {
      if (!tags.includes(tag)) {
        let tobj = { ...tagObj };

        tobj.name = tag;

        tagList.push(tobj);

        tags.push(tag);
      }
    });
  }
}

//设置标签
function setSelectFontTags(selectFontList, tags) {
  selectFontList.forEach((fonObj) => {
    fonObj.tags = tags;
  });
}

//选择标签
function selectTags(fontList, selectTagNames) {
  let flag = false;

  fontList.forEach((fontObj) => {
    fontObj._visiable = false;
  });

  fontList.forEach((fontObj) => {
    if (isArrayContained(fontObj.tags, selectTagNames)) {
      fontObj._visiable = true;
      flag = true;
      return;
    }
  });

  if (!flag && selectTagNames.length == 0) {
    fontList.forEach((fontObj) => {
      fontObj._visiable = true;
    });
  }
}

//保存文件
function saveFontFileJson(fontList) {
  var data = JSON.stringify(fontList);
  var result = window.cep.fs.writeFile(
    userDataPath + "fontManage/fontManage.json",
    data
  );
  if (0 == result.err) {
    // console.log("保存到：" + fileName);
  } else {
    alert("保存错误\n" + fileName + "\nerr code:" + result.err);
  }
}

//应用字体
function appleyFont(fontObj) {
  csInterface.evalScript(
    "ps_applyLayerFont('" +
      fontObj.postScriptName +
      "' , '" +
      fontObj.family +
      "' , '" +
      fontObj.style +
      "')"
  );
}

//搜索字体
function searchFont(fontList, fontName) {
  fontList.forEach((fontObj) => {
    fontObj._visiable = false;
  });
  fontList.forEach((fontObj) => {
    if (containsSubstringIgnoreCase(fontObj.name,fontName)) {
      fontObj._visiable = true;
    }
  });
}

csInterface.evalScript('$.evalFile("' + extPath + "json2.js" + '")');
