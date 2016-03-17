/*!
 * index.js v1.0.1
 * (c) 2016 Jin Tian
 * Released under the GPL License.
 */
var xlsx = require("node-xlsx");

var ORDER_DETAIL = [];
//var TAX_RATE = 1.17 ;

var init_100 = function(){
  MSG.put("系统启动。");

  // 充当数据源的文件 的文件名 的关键字
  other_files = [];
  other_files.push("到货数据");
  other_files.push("自有调社会");

  order_files = [];
  order_files.push("终端销售明细表咸阳");
  order_files.push("终端销售明细表商洛");
  order_files.push("终端销售明细表安康");
  order_files.push("终端销售明细表宝鸡");
  order_files.push("终端销售明细表延安");
  order_files.push("终端销售明细表榆林");
  order_files.push("终端销售明细表汉中");
  order_files.push("终端销售明细表渭南");
  order_files.push("终端销售明细表西安");
  order_files.push("终端销售明细表铜川");

  vm.src_files_flag = order_files.concat(other_files);
  //console.log(vm.src_files_flag);
  vm.order_files_flag = order_files;

  return true;
}

var check_env_110 = function(){
  
  // 程序运行所必须的库和配置文件
  var envlist = [];
  envlist.push("config.json");
  envlist.push("node_modules/node-xlsx/");
  envlist.push("node_modules/underscore/underscore-min.js");

  return true;
};

var select_file_120 = function(){

  if(fs.existsSync(vm.sales_filename)) {
    console.log('销售记录文件存在');
    
  } else {
    console.log('销售记录文件不存在');
    document.getElementById("file_src").click();
  }
  return true;
};

// 检查输入文件是否齐备。
var check_src_130 = function(){
  var run_flag = true;

  // 设置base_dir
  var temp_path = document.getElementById("file_src").value;
  vm.base_dir = path.dirname(temp_path ) + "/" ;
  console.log("base_dir: " + vm.base_dir );

  // 自动寻找 程序运行所必须的数据源
  vm.src_files = find_src_file(vm.base_dir, vm.src_files_flag);
  //console.log( vm.src_files);

  for( temp_name in vm.src_files){
    if( undefined === vm.src_files[temp_name]){
      ERR_MSG.put( "输入文件不全。缺少：" + temp_name );
      run_flag = false;
    }
  }
  return run_flag;
}

var check_order_140 = function(){
  var run_flag = true;
  
  //  终端销售明细表  格式检查
  var must_field = [];
  must_field.push("物料类型");
  must_field.push("物料编码");
  must_field.push("机型");
  // must_field.push("采购来源");   // 这个数据不知道从哪里取
  // must_field.push("单价");   // 这个数据不知道从哪里取
  must_field.push("归属地州");
  must_field.push("手机号码");
  must_field.push("手机串码");
  must_field.push("销售数量");
  must_field.push("录入日期");
  
  ORDER_DETAIL.push(must_field);

  // 循环检查所有销售订单文件
  for( var i=0; i<vm.order_files_flag.length; i++ ){
    var temp_filename = vm.src_files[vm.order_files_flag[i]];
    console.log(temp_filename);

    var obj = null;
    obj = xlsx.parse( vm.base_dir + temp_filename ); // 读入xlsx文件
    console.log(vm.order_files_flag[i]);
    MSG.put("开始检查：" + vm.order_files_flag[i]);
    // console.log(obj);
    
    // 取出第一个sheet 的第一行。检查标题栏的内容是否正确
    var order_info = obj[0].data;
    var all_title = order_info[0];
    console.log(all_title);
    run_flag = check_must_title(all_title, must_field);

    if( run_flag ){
      var index_must = [];
      index_must = find_title_index_from_array(all_title, must_field);
      
      console.log(index_must);
      order_info2 = select_col_from_array( order_info, index_must);
      ORDER_DETAIL = ORDER_DETAIL.concat( _.rest(order_info2) );
      //console.log("ORDER_DETAIL.length=" + ORDER_DETAIL.length);
    }else{
      break;
    }
  }

  setTimeout(function() {
    document.getElementById('srcfile_area').style.cssText = "font-size:9px;color:grey;";
    console.log( document.getElementById('srcfile_area').style );
  }, 3*1000);
  return run_flag;
}

var check_IMEI_conflict_150 = function() {
  // 检查历史数据，看是否有重复数据，有则显示警告信息。
  var all_order = getAllOrder();
  var imei_index = find_title_index(all_order[0], "手机串码");
  var imei_array = select_one_col_from_table( all_order, imei_index);
  for(var i=0; i<ORDER_DETAIL.length; i++){
    if( _.indexOf(imei_array, ORDER_DETAIL[i][imei_index]) > -1 ){
      ERR_MSG.put("数据异常：发现重复的「手机串码」。 " + ORDER_DETAIL[i] );
    }
  }

  return true;
}


var check_arrival_160 = function(){
  // 到货数据  格式检查
  var must_field = [];
  must_field.push("记录的创建日期");
  must_field.push("数量");
  must_field.push("移出物料");
  must_field.push("移出物料描述");
  must_field.push("移入库位描述");

  return true;
}

var check_transfer_170 = function(){
  //  自有调社会  格式检查
  var must_field2 = [];
  must_field2.push("物料编号");
  must_field2.push("物料描述");
  must_field2.push("实际交货日期");
  must_field2.push("实际交货数量");
  must_field2.push("物料编号");
  
  return true;
}

var calc_180 = function(){
  //  计算物料组分项汇总
  var title = [];
  title.push("序号");
  title.push("类型");
  title.push("分公司");
  title.push("机型");
  title.push("采购来源");
  title.push("是否智能手机");
  title.push("单价");
  title.push("机型代码");
  title.push("期末结余");
  title.push("本期销售");
  title.push("累计前一天销量");
  title.push("本期到货数量合计");
  title.push("02月到货");
  title.push("自有调社会");
  title.push("本日出库");
  title.push("月销量");
  title.push("月结余数量");
  title.push("上市时间");
  title.push("当日时间");
  title.push("上市时长");
  title.push("日存销比");
  var title_length = title.length;
  function make_line(){
    var line = [];
    for(var i=0; i<title_length; i++){
      line.push("");
    }
    return line;
  };

  var all_title = ORDER_DETAIL[0];
  var city_index = find_title_index(all_title, "归属地州");
  var prod_index = find_title_index(all_title, "机型");
  var count_index = find_title_index(all_title, "销售数量");


  // 获得不重复的地市列表
  var city_list = select_one_col_from_table( ORDER_DETAIL, city_index);
  city_list = _.rest(city_list);  // 去除第0个元素：标题行
  city_list = _.unique(city_list);
  city_list.sort();
  console.log(city_list);
  MSG.put("地市列表： [" + city_list.join() + "]");

  // 获得不重复的机型列表
  var all_prod_type = select_one_col_from_table( ORDER_DETAIL, prod_index);
  for(i=0;i<all_prod_type.length;i++){
    if( undefined === all_prod_type[i] || "" === all_prod_type[i] ){
      console.log("undefined at " + i );
      ERR_MSG.put("数据错误：发现错误机型数据 " + ORDER_DETAIL[i] );
    }
  }
  //console.log(all_prod_type);
  all_prod_type = _.rest(all_prod_type);  // 去除第0个元素：标题行
  all_prod_type = _.unique(all_prod_type);
  all_prod_type.sort();
  console.log(all_prod_type);

  var all_city = [];
  all_city.push("西安城区");
  all_city.push("西安区县");
  all_city.push("咸阳");
  all_city.push("宝鸡");
  all_city.push("渭南");
  all_city.push("铜川");
  all_city.push("延安");
  all_city.push("榆林");
  all_city.push("汉中");
  all_city.push("安康");
  all_city.push("商洛");
  
  // 构造空白的二维数组
  var branch_index = find_title_index(title, "分公司");
  var result_prod_index = find_title_index(title, "机型");
  var sales_index = find_title_index(title, "本日出库");
  var result_array = [];
  result_array.push(title);
  for(var i=0; i<all_prod_type.length; i++ ){
    var prod = all_prod_type[i];
    for(var j=0; j<all_city.length; j++){
      var temp = make_line();

      temp[branch_index] = all_city[j];
      temp[result_prod_index] = all_prod_type[i];
      temp[sales_index] = 0;
      result_array.push(temp);
    }
  }

  // 填充数据
  for(var i=1;i<ORDER_DETAIL.length;i++){
    var order = ORDER_DETAIL[i];
    var city = order[city_index];
    var prod = order[prod_index];
    var count = order[count_index];

    for(var j=1; j<result_array.length; j++){
      var temp = result_array[j];
      var city2 = temp[branch_index];
      var prod2 = temp[result_prod_index];
      
      if(city===city2 && prod === prod2 ){
        temp[sales_index] += count;
        console.log(count);
        break;
      }
    }
  }
                      
  // 把计算结果存入文件。
  var buffer = xlsx.build([{name: "铺货终端报表（分地市）", data: result_array }] );
  fs.writeFileSync( vm.base_dir + "中间文件_第一步.xlsx", buffer);

  return true;
}


var todo_190 = function(){
  return true;
}

// 订单数据存入数据库
var order_to_db_350 = function(){
  var all_order = getAllOrder();
  var all_data = all_order.concat( _.rest(ORDER_DETAIL) ); // 合并数组时，不要第一行：标题行

  // 把所有数据存入历史记录文件。
  var buffer = xlsx.build([{name: "本月销售订单", data: all_data }] );
  fs.writeFileSync( "db/all_order.xlsx", buffer);
}





// 获得当月全部订单数据。
var getAllOrder = function(){
  var all_order = getData_from_xlsx("db/all_order.xlsx");
  if( all_order === null ){
    all_order = [];
  }
  return all_order;
}

var getData_from_xlsx = function( fullpath ){
  var data = null;
  if( fs.existsSync(fullpath) ){
    var obj = null;
    obj = xlsx.parse( fullpath ); // 读入xlsx文件
    data = obj[0].data;
  }
  return data;
}


var check_must_title = function(target, keywords ){
  var run_flag = true;
  for(var i=0; i<keywords.length; i++ ){
    var kw = keywords[i];
    if( -1 === _.indexOf(target, kw)){
      // 显示出错提示。
      ERR_MSG.put("数据出错：。无法找到「"+ kw +"」列，请检查数据的第一行。" );
      console.log("数据出错：。无法找到「"+ kw +"」列，请检查数据的第一行。");
      console.log(target);
      run_flag = false;
    }
  }
  return run_flag;
}

var test = function(){
  var temp = new Array(10);
  console.log( temp );
  console.log( temp.length );
}













