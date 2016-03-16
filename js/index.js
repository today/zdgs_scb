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
  //order_files.push("终端销售明细表咸阳");
  //order_files.push("终端销售明细表商洛");
  order_files.push("终端销售明细表安康");
  //order_files.push("终端销售明细表宝鸡");
  //order_files.push("终端销售明细表延安");
  //order_files.push("终端销售明细表榆林");
  //order_files.push("终端销售明细表汉中");
  order_files.push("终端销售明细表渭南");
  order_files.push("终端销售明细表西安");
  //order_files.push("终端销售明细表铜川");

  vm.src_files_flag = order_files.concat(other_files);
  vm.order_files_flag = order_files;
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
  
  console.log( vm.src_files);

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
  must_field.push("物料编码");
  must_field.push("机型");
  must_field.push("归属地州");
  must_field.push("手机号码");
  must_field.push("手机串码");
  must_field.push("录入日期");
  
  ORDER_DETAIL.push(must_field);

  // 循环检查所有销售订单文件
  for( var i=0; i<vm.order_files_flag.length; i++ ){
    var temp_filename = vm.src_files[vm.order_files_flag[i]];
    console.log(temp_filename);

    var obj = null;
    obj = xlsx.parse( vm.base_dir + temp_filename ); // 读入xlsx文件
    // console.log(vm.src_files['销售订单明细']);
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
      console.log("ORDER_DETAIL.length=" + ORDER_DETAIL.length);
    }
  }

  // 检查历史数据，看是否有重复数据，有则报错。
  var all_order = getAllOrder();
  var imei_index = find_title_index(all_order[0], "手机串码");
  var imei_array = select_col_from_array( all_order, imei_index);



  setTimeout(function() {
    document.getElementById('srcfile_area').style.cssText = "font-size:9px;color:grey;";
    console.log( document.getElementById('srcfile_area').style );
  }, 3*1000);
  return run_flag;
}

// 订单数据存入数据库
var order_to_db_150 = function(){
  
  



  // 把所有数据存入DB。

}

var check_arrival_160 = function(){
  // 到货数据  格式检查
  var must_field = [];
  must_field.push("记录的创建日期");
  must_field.push("数量");
  must_field.push("移出物料");
  must_field.push("移出物料描述");
  must_field.push("移入库位描述");

  console.log("ORDER_DETAIL.length=" + ORDER_DETAIL.length);

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
      run_flag = false;
    }
  }
  return run_flag;
}













